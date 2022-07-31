/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { got } from "got";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";
import { format } from "prettier";
import { argv, fs, path } from "zx";

// Load the environment variables (API_ORIGIN, etc.)
envars.config({ env: argv.env ?? "local" });
const schemaURL = `${process.env.API_ORIGIN}/api`;

// Download and save GraphQL API schema
got
  .post(schemaURL, { json: { query: getIntrospectionQuery() } })
  .json()
  .then((res) => {
    const schema = buildClientSchema(res.data);
    const filename = path.resolve(__dirname, "../schema.graphql");
    let output = printSchema(schema, { commentDescriptions: true });
    output = format(output, { parser: "graphql" });
    fs.writeFileSync(filename, output, { encoding: "utf-8" });
    console.log(`Saved ${schemaURL} to ${path.basename(filename)}`);
  })
  .catch((err) => {
    console.error(err.stack);
    process.exitCode = 1;
  });
