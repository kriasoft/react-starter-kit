# File Uploads

This recipe adds file uploads using [Cloudflare R2](https://developers.cloudflare.com/r2/) with presigned URLs. A tRPC procedure validates the request and generates a signed PUT URL, then the client uploads directly to R2 – keeping the API worker lightweight.

## 1. Create the R2 bucket

The edge module already has the bucket – it is just switched off. Turn it on for the environment you are working in, and list the origins allowed to upload:

```hcl
// infra/envs/staging/main.tf
module "edge" {
  source = "../../modules/cloudflare"

  account_id           = var.cloudflare_account_id
  project_slug         = var.project_slug
  environment          = "staging"
  database_url         = var.database_url
  uploads_enabled      = true // [!code ++]
  uploads_cors_origins = ["https://staging.example.com"] // [!code ++]
}
```

`uploads_cors_origins` is not optional decoration. The browser uploads straight to R2, and R2 rejects a cross-origin `PUT` when the bucket has no CORS policy – however valid the presigned URL is. Terraform provisions the policy alongside the bucket, allowing `PUT` with `Content-Type` from those origins only. Reads go back through the API worker, so the browser never needs `GET` here.

Apply it, and note the bucket name it prints:

```bash
bun infra:staging apply
bun infra:staging workspace show    # must end in -staging
bun infra:staging output uploads_bucket_name
```

`output` reads from state without re-running the workspace guard, so confirm the workspace before trusting the name – a stale `TF_WORKSPACE` prints the other environment's bucket.

The Terraform API token needs **Account → Workers R2 Storage → Edit** for this.

## 2. Configure bindings and secrets

Bind the bucket to the API worker for serving files, and add the two non-secret values presigning needs:

```jsonc
// apps/api/wrangler.jsonc
{
  "r2_buckets": [
    {
      "binding": "UPLOADS_BUCKET",
      "bucket_name": "example-production-uploads",
    },
  ],
  "vars": {
    "R2_S3_ENDPOINT": "https://<account-id>.r2.cloudflarestorage.com",
    "R2_BUCKET_NAME": "example-production-uploads",
  },
}
```

Repeat both blocks in the `staging` environment with that environment's bucket name. The name appears twice because the binding serves files while the S3-compatible endpoint signs uploads, and signing needs the name as a string.

::: tip

`R2_S3_ENDPOINT` is the S3-compatible endpoint. Find it in the R2 dashboard under **Settings → S3 API**, or build it from your account ID.

:::

Create an [R2 API token](https://developers.cloudflare.com/r2/api/s3/tokens/) with **Object Read & Write** permission, and choose **Apply to specific buckets only** – scope it to this environment's uploads bucket alone. The token signs every presigned URL the API hands out, so its blast radius is whatever it can reach. Then add the credentials as Worker secrets:

```bash
bun wrangler secret put R2_ACCESS_KEY_ID \
  --config apps/api/wrangler.jsonc --env staging
bun wrangler secret put R2_SECRET_ACCESS_KEY \
  --config apps/api/wrangler.jsonc --env staging
```

Add both names to `secrets.required` in `apps/api/wrangler.jsonc` so a deploy that forgets them fails immediately instead of returning errors at runtime – but only in the environments where you actually enabled uploads. `secrets.required` is not inherited, so each environment block lists its own; adding them to production while uploads are staging-only would make production undeployable until you provisioned credentials for a bucket that does not exist. Leave `dev` alone either way, since a populated `secrets.required` limits local `.env` loading to exactly the keys it lists.

Add the binding type in `apps/api/worker.ts`:

```ts
type CloudflareEnv = {
  HYPERDRIVE_CACHED: Hyperdrive;
  HYPERDRIVE_UNCACHED: Hyperdrive;
  // Optional: the binding only exists where uploads are enabled, and the
  // handlers below check for it. Declaring it required would type-check a
  // deployment that cannot work.
  UPLOADS_BUCKET?: R2Bucket; // [!code ++]
} & Env;
```

Add the S3 API credentials to the env schema in `apps/api/lib/env.ts`:

```ts
export const envSchema = z.object({
  // ...existing vars
  R2_ACCESS_KEY_ID: z.string().optional(), // [!code ++]
  R2_SECRET_ACCESS_KEY: z.string().optional(), // [!code ++]
  R2_S3_ENDPOINT: z.url().optional(), // [!code ++]
  R2_BUCKET_NAME: z.string().optional(), // [!code ++]
});
```

Install [`aws4fetch`](https://github.com/mhart/aws4fetch) for signing presigned URLs in Workers:

```bash
bun add --filter @repo/api aws4fetch
```

## 3. Create the upload procedure

Add a router that generates presigned PUT URLs and confirms uploads:

```ts
// apps/api/routers/upload.ts
import { AwsClient } from "aws4fetch";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc.js";

// The enum is the allowlist, so the extension lookup is total and the parsed
// type narrows to these four keys. The extension never comes from the filename.
const contentTypeSchema = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const EXTENSION_BY_CONTENT_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
} satisfies Record<z.infer<typeof contentTypeSchema>, string>;

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const UPLOAD_URL_TTL_SECONDS = 120; // see the note on reuse below

export const uploadRouter = router({
  /** Generate a presigned PUT URL for direct client-to-R2 upload. */
  createUrl: protectedProcedure
    .input(
      z.object({
        contentType: contentTypeSchema,
        // `File.size` is a byte count: reject fractions and negatives that
        // `z.number()` alone would accept.
        sizeBytes: z.number().int().nonnegative().max(MAX_UPLOAD_SIZE_BYTES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY,
        R2_S3_ENDPOINT,
        R2_BUCKET_NAME,
      } = ctx.env;

      if (
        !R2_ACCESS_KEY_ID ||
        !R2_SECRET_ACCESS_KEY ||
        !R2_S3_ENDPOINT ||
        !R2_BUCKET_NAME
      ) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "File uploads are not configured",
        });
      }

      // Namespace by organization, falling back to the user when none is
      // active – the same rule as `billing.ts`. Prefixed IDs (`org_…`, `usr_…`)
      // cannot collide. Interpolating a nullable value here would put every
      // org-less user under a shared `undefined/` prefix.
      const ownerId = ctx.session.activeOrganizationId ?? ctx.user.id;

      // Built entirely from values the server controls. Never interpolate a
      // client-supplied filename here – see the warning below.
      const key = `${ownerId}/${crypto.randomUUID()}.${EXTENSION_BY_CONTENT_TYPE[input.contentType]}`;

      const r2 = new AwsClient({
        service: "s3", // Required by aws4fetch; R2 ignores both
        region: "auto",
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      });

      const url = new URL(`${R2_S3_ENDPOINT}/${R2_BUCKET_NAME}/${key}`);
      url.searchParams.set("X-Amz-Expires", String(UPLOAD_URL_TTL_SECONDS));

      const signed = await r2.sign(
        new Request(url, {
          method: "PUT",
          headers: { "Content-Type": input.contentType },
        }),
        { aws: { signQuery: true } },
      );

      return { key, uploadUrl: signed.url };
    }),

  /** Verify the stored object and return its metadata. */
  confirm: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const uploads = (ctx.env as { UPLOADS_BUCKET?: R2Bucket }).UPLOADS_BUCKET;
      if (!uploads) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "R2 binding not configured",
        });
      }

      // The key arrives from the client, so re-derive who may claim it.
      // Without this, any signed-in user who learns a key can read its size.
      const ownerId = ctx.session.activeOrganizationId ?? ctx.user.id;
      if (!input.key.startsWith(`${ownerId}/`)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const object = await uploads.head(input.key);
      if (!object) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Object not found" });
      }

      // `sizeBytes` in createUrl was the browser's claim; a presigned PUT signs
      // the method, key and content type, never the body length. Reject an
      // oversized object and reclaim its space.
      if (object.size > MAX_UPLOAD_SIZE_BYTES) {
        await uploads.delete(input.key);
        throw new TRPCError({
          code: "PAYLOAD_TOO_LARGE",
          message: "File exceeds the 10 MB limit",
        });
      }

      return { key: input.key, sizeBytes: object.size };
    }),
});
```

::: danger Never build the key from the filename

An earlier version of this recipe used `` `${ownerId}/${uuid}/${input.filename}` ``. That is exploitable: `filename` is client input, and the `URL` constructor resolves `..` segments before the request is signed.

```txt
filename = "../../org_victim/steal.png"
  → signed PUT for  /my-bucket/org_victim/steal.png

filename = "../../../other-bucket/evil.jpg"
  → signed PUT for  /other-bucket/evil.jpg
```

The second escapes the bucket entirely, reaching anything the R2 token can write. Deriving the extension from the allowlisted `contentType` removes the problem at the source rather than relying on sanitising filenames. Keep the original name in your own table alongside the key, where it is data rather than an identifier – which is why `createUrl` does not take a `filename` at all.

:::

::: warning What the presigned URL does not enforce

`MAX_UPLOAD_SIZE_BYTES` is **not** a hard storage limit. A presigned URL is a bearer token, valid until it expires and reusable within that window, and the signature covers the method, key and `Content-Type` but never the body length. An authenticated caller can request a URL claiming `sizeBytes: 1`, upload a gigabyte, and simply never call `confirm` – or let `confirm` delete it and re-`PUT` with the same URL.

What the checks above do give you: only signed-in users get URLs, `confirm` rejects an oversized object and reclaims its space, and the short `UPLOAD_URL_TTL_SECONDS` keeps the reuse window small. Note that `confirm` records nothing – it reads the object back and returns its metadata, so the serving route below will hand over any correctly namespaced object whether or not it was ever confirmed. Persisting an upload record is left to you, and is what the cleanup note below assumes. Abandoned objects are not cleaned up: completed and abandoned uploads share the same `<owner>/<uuid>.<ext>` shape, so no lifecycle rule can tell them apart. If you need automatic cleanup, track upload state in your database and sweep objects that were never confirmed, or write pending uploads under a separate prefix that a lifecycle rule can expire.

The allowlisted `Content-Type` is also still a browser claim; this recipe does not inspect file bytes. Before parsing files or serving user uploads inline, verify their signatures with a format-aware library and set a safe `Content-Disposition`. Keep unverified content on a separate origin when possible.

If you need the limit to be genuinely hard, stop presigning and stream the upload through the API worker into its `UPLOADS_BUCKET` binding, rejecting the body past 10 MB. You lose the direct-to-R2 path but gain an enforceable ceiling – a reasonable trade at this file size.

:::

Register it in `apps/api/lib/app.ts`:

```ts
import { uploadRouter } from "../routers/upload.js";

const appRouter = router({
  // ...existing routers
  upload: uploadRouter, // [!code ++]
});
```

## 4. Upload from the frontend

```tsx
import { trpcClient } from "@/lib/trpc";

async function uploadFile(file: File) {
  // 1. Get a presigned URL from the API
  const { key, uploadUrl } = await trpcClient.upload.createUrl.mutate({
    contentType: file.type,
    sizeBytes: file.size,
  });

  // 2. Upload directly to R2
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

  // 3. Verify the stored object and get its metadata
  return trpcClient.upload.confirm.mutate({ key });
}
```

Wire it to a file input:

```tsx
function FileUpload() {
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadFile(file);
    console.log("Uploaded:", result.key);
  }

  return <input type="file" accept="image/*,.pdf" onChange={handleChange} />;
}
```

## 5. Serve files

Add a Hono route that reads from R2 via the binding. Uploads are **private by default** here: keys are organization-scoped, so serving them must be too.

```ts
// apps/api/routes/uploads.ts
import { Hono } from "hono";
import type { AppContext } from "../lib/context.js";

const uploads = new Hono<AppContext>();

uploads.get("/api/uploads/:key{.+}", async (c) => {
  const bucket = (c.env as { UPLOADS_BUCKET?: R2Bucket }).UPLOADS_BUCKET;
  if (!bucket) return c.json({ error: "R2 not configured" }, 503);

  const auth = c.get("auth");
  const session = await auth?.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  // Scope the read to the caller. 404 rather than 403 – a 403 would confirm
  // the key exists to someone who only guessed it.
  const ownerId = session.session.activeOrganizationId ?? session.user.id;
  const key = c.req.param("key");
  if (!key.startsWith(`${ownerId}/`)) {
    return c.notFound();
  }

  const object = await bucket.get(key);
  if (!object) return c.notFound();

  return new Response(object.body, {
    headers: {
      "Content-Type":
        object.httpMetadata?.contentType ?? "application/octet-stream",
      // Whether this URL may be served depends on who is asking, so the
      // browser must ask again every time: `no-cache` still lets it store the
      // response, but never reuse one without revalidating, which re-runs the
      // check above. A long max-age would instead let a shared browser replay
      // the file to the next person to sign in. Use `no-store` if the files
      // are sensitive enough that they should not touch disk at all.
      "Cache-Control": "private, no-cache",
    },
  });
});

export { uploads };
```

Mount it in `apps/api/lib/app.ts`:

```ts
import { uploads } from "../routes/uploads.js";

app.route("/", uploads); // [!code ++]
```

Files are served at `/api/uploads/<key>`.

::: tip Serving public assets instead

For genuinely public files – avatars, logos, marketing images – drop the session check and use `Cache-Control: public, max-age=31536000, immutable`. Once the response no longer depends on who asked, a long-lived cache is safe again.

That header buys you browser caching only. The API worker sets no `cache` block, so Cloudflare does not cache its responses at the edge and every request still runs the worker. Do not switch caching on for the whole API to change that – with it enabled, a `200` carrying no `Cache-Control` picks up a two-hour heuristic TTL, which is the wrong default for tRPC and auth.

To skip the worker entirely, an [R2 custom domain](https://developers.cloudflare.com/r2/buckets/public-buckets/) serves objects straight from the bucket. Use it only for a bucket whose **entire contents** are public: public access is a bucket-level switch with no per-prefix rules, so attaching a domain to the `-uploads` bucket above would publish every user's private files along with the avatars. Give public assets their own bucket.

Serving a public prefix out of a mixed bucket means keeping the worker and dropping only the session check for that prefix. Either way, do not treat an unguessable key as the authorization mechanism – that works until a URL is pasted into a support ticket or leaks through a `Referer` header.

:::

## Reference

- [Cloudflare R2 docs](https://developers.cloudflare.com/r2/) – bucket API, S3 compatibility, pricing
- [R2 S3 API tokens](https://developers.cloudflare.com/r2/api/s3/tokens/) – creating API credentials
- [aws4fetch](https://github.com/mhart/aws4fetch) – lightweight AWS Signature V4 for Workers
- [Security Checklist](/security/checklist) – file upload validation (type, size, content)
- [Add a tRPC Procedure](/recipes/new-procedure) – procedure patterns
