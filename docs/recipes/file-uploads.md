# File Uploads

This recipe adds file uploads using [Cloudflare R2](https://developers.cloudflare.com/r2/) with presigned URLs. A tRPC procedure validates the request and generates a signed PUT URL, then the client uploads directly to R2 – keeping the API worker lightweight.

## 1. Create the R2 bucket

Provision a bucket using the existing Terraform module in `infra/modules/cloudflare/r2-bucket/`:

```hcl
# infra/stacks/<env>/main.tf
module "uploads" {
  source     = "../../modules/cloudflare/r2-bucket"
  account_id = var.cloudflare_account_id
  name       = "${var.project}-uploads-${var.environment}"
}
```

Apply the change:

```bash
cd infra/stacks/<env>
terraform apply
```

## 2. Configure bindings and secrets

Bind the bucket to the API worker for serving files:

```jsonc
// apps/api/wrangler.jsonc
{
  "r2_buckets": [
    {
      "binding": "UPLOADS",
      "bucket_name": "rsk-uploads-production",
    },
  ],
}
```

Create an [R2 API token](https://developers.cloudflare.com/r2/api/s3/tokens/) with **Object Read & Write** permission, then add the credentials as Worker secrets:

```bash
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
```

Add the binding type in `apps/api/worker.ts`:

```ts
type CloudflareEnv = {
  HYPERDRIVE_CACHED: Hyperdrive;
  HYPERDRIVE_DIRECT: Hyperdrive;
  UPLOADS: R2Bucket; // [!code ++]
} & Env;
```

Add the S3 API credentials to the env schema in `apps/api/lib/env.ts`:

```ts
export const envSchema = z.object({
  // ...existing vars
  R2_ACCESS_KEY_ID: z.string().optional(), // [!code ++]
  R2_SECRET_ACCESS_KEY: z.string().optional(), // [!code ++]
  R2_ENDPOINT: z.url().optional(), // [!code ++]
  R2_BUCKET_NAME: z.string().optional(), // [!code ++]
});
```

::: tip
`R2_ENDPOINT` is the S3-compatible endpoint: `https://<account-id>.r2.cloudflarestorage.com`. Find it in the R2 dashboard under **Settings > S3 API**.
:::

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

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const URL_EXPIRY = 600; // 10 minutes

export const uploadRouter = router({
  /** Generate a presigned PUT URL for direct client-to-R2 upload. */
  requestUpload: protectedProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        contentType: z.string().refine((t) => ALLOWED_TYPES.includes(t), {
          message: "Unsupported file type",
        }),
        size: z.number().max(MAX_SIZE),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        R2_ACCESS_KEY_ID,
        R2_SECRET_ACCESS_KEY,
        R2_ENDPOINT,
        R2_BUCKET_NAME,
      } = ctx.env;

      if (
        !R2_ACCESS_KEY_ID ||
        !R2_SECRET_ACCESS_KEY ||
        !R2_ENDPOINT ||
        !R2_BUCKET_NAME
      ) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "File uploads are not configured",
        });
      }

      const key = `${ctx.session.activeOrganizationId}/${crypto.randomUUID()}/${input.filename}`;

      const r2 = new AwsClient({
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      });

      const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`);
      url.searchParams.set("X-Amz-Expires", String(URL_EXPIRY));

      const signed = await r2.sign(
        new Request(url, {
          method: "PUT",
          headers: { "Content-Type": input.contentType },
        }),
        { aws: { signQuery: true } },
      );

      return { key, uploadUrl: signed.url };
    }),

  /** Confirm upload and return metadata. */
  complete: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const uploads = (ctx.env as { UPLOADS?: R2Bucket }).UPLOADS;
      if (!uploads) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "R2 binding not configured",
        });
      }

      const object = await uploads.head(input.key);
      if (!object) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Object not found" });
      }
      return { key: input.key, size: object.size };
    }),
});
```

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
  const { key, uploadUrl } = await trpcClient.upload.requestUpload.mutate({
    filename: file.name,
    contentType: file.type,
    size: file.size,
  });

  // 2. Upload directly to R2
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

  // 3. Confirm and store metadata
  return trpcClient.upload.complete.mutate({ key });
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

Add a Hono route that reads from R2 via the binding:

```ts
// apps/api/routes/uploads.ts
import { Hono } from "hono";
import type { AppContext } from "../lib/context.js";

const uploads = new Hono<AppContext>();

uploads.get("/api/uploads/:key{.+}", async (c) => {
  const bucket = (c.env as { UPLOADS?: R2Bucket }).UPLOADS;
  if (!bucket) return c.json({ error: "R2 not configured" }, 503);

  const object = await bucket.get(c.req.param("key"));
  if (!object) return c.notFound();

  return new Response(object.body, {
    headers: {
      "Content-Type":
        object.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
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

## Reference

- [Cloudflare R2 docs](https://developers.cloudflare.com/r2/) – bucket API, S3 compatibility, pricing
- [R2 S3 API tokens](https://developers.cloudflare.com/r2/api/s3/tokens/) – creating API credentials
- [aws4fetch](https://github.com/mhart/aws4fetch) – lightweight AWS Signature V4 for Workers
- [Security Checklist](/security/checklist) – file upload validation (type, size, content)
- [Add a tRPC Procedure](/recipes/new-procedure) – procedure patterns
