/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Deploys application bundle to Cloudflare. Usage:
 *
 *   $ yarn deploy [--env #0]
 *
 * @see https://developers.cloudflare.com/workers/
 * @see https://api.cloudflare.com/#worker-script-upload-worker
 */

const fs = require("fs");
const got = require("got");
const path = require("path");
const globby = require("globby");
const minimist = require("minimist");
const FileType = require("file-type");
const FormData = require("form-data");
const dotenv = require("dotenv");
const { EOL } = require("os");

// Create an example .env file
if (!fs.existsSync("./.env")) {
  fs.writeFileSync(
    "./.env",
    [
      "# Cloudflare",
      "# https://dash.cloudflare.com/",
      "# https://developers.cloudflare.com/api/tokens/create",
      "CLOUDFLARE_ACCOUNT_ID=",
      "CLOUDFLARE_ZONE_ID=",
      "CLOUDFLARE_API_TOKEN=",
    ].join(EOL),
    { encoding: "utf-8" }
  );
}

// Load environment variables from the .env file
dotenv.config();

const env = process.env;
const args = minimist(process.argv.slice(2));
const buildDir = path.resolve(__dirname, "../.build");

// The name of the worker script (e.g. "proxy", "proxy-test", etc.)
const envName = args.env || "test";
const worker = envName === "prod" ? "proxy" : `proxy_${envName}`;
const assetsNS = envName === "prod" ? "web" : `web_${envName}`;

// Configure an HTTP client for accessing Cloudflare REST API
const cf = got.extend({
  prefixUrl: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/`,
  headers: { authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}` },
  responseType: "json",
  resolveBodyOnly: true,
  hooks: {
    afterResponse: [
      function (res) {
        if (!res.body?.success) throw new Error(res.body.errors[0].message);
        res.body?.messages.forEach((x) => console.log(x));
        res.body = res.body.result || res.body;
        return res;
      },
    ],
  },
});

async function deploy() {
  // Create a KV storage namespace.
  // https://api.cloudflare.com/#workers-kv-namespace-list-namespaces

  let res = await cf.get({ url: "storage/kv/namespaces" });
  let ns = res.find((x) => x.title === assetsNS);

  if (!ns) {
    console.log(`Creating KV namespace: ${assetsNS}`);
    ns = await cf.post({
      url: "storage/kv/namespaces",
      json: { title: assetsNS },
    });
  }

  // Upload website assets to KV storage.
  // https://api.cloudflare.com/#workers-kv-namespace-write-multiple-key-value-pairs

  console.log(`Uploading assets to KV storage: ${ns.title}, id: ${ns.id}`);

  const cwd = path.resolve(buildDir, "web");
  const files = await globby(".", { cwd });

  for (let i = 0; i < files.length; i++) {
    const data = fs.readFileSync(path.resolve(cwd, files[i]));
    const type = await FileType.fromBuffer(data);
    files[i] = type
      ? { key: files[i], value: data.toString("base64"), base64: true }
      : { key: files[i], value: data.toString("utf-8") };
  }

  await cf.put({ url: `storage/kv/namespaces/${ns.id}/bulk`, json: files });

  /*
   * Upload the reverse proxy script to Cloudflare Workers.
   */

  console.log(`Uploading Cloudflare Worker script: ${worker}`);

  const form = new FormData();
  const script = fs.readFileSync(path.resolve(buildDir, "workers/proxy.js"), {
    encoding: "utf-8",
  });
  const bindings = [
    { type: "kv_namespace", name: "__STATIC_CONTENT", namespace_id: ns.id },
    { type: "plain_text", name: "__STATIC_CONTENT_MANIFEST", text: "false" },
  ];
  const metadata = { body_part: "script", bindings };
  form.append("script", script, { contentType: "application/javascript" });
  form.append("metadata", JSON.stringify(metadata), {
    contentType: "application/json",
  });

  await cf.put({
    url: `workers/scripts/${worker}`,
    headers: form.getHeaders(),
    body: form,
  });

  console.log("Done!");
}

deploy().catch((err) => {
  console.error(err);
  process.exit(1);
});
