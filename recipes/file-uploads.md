---
url: /recipes/file-uploads.md
---
# File Uploads

This recipe adds file uploads using [Cloudflare R2](https://developers.cloudflare.com/r2/) with presigned URLs. The client uploads directly to R2, keeping the API worker lightweight.

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

## 2. Add the R2 binding

Bind the bucket to the API worker in `apps/api/wrangler.jsonc`:

```jsonc
{
  "r2_buckets": [
    {
      "binding": "UPLOADS",
      "bucket_name": "rsk-uploads-production",
    },
  ],
}
```

Add the binding type in `apps/api/worker.ts`:

```ts
type CloudflareEnv = {
  HYPERDRIVE_CACHED: Hyperdrive;
  HYPERDRIVE_DIRECT: Hyperdrive;
  UPLOADS: R2Bucket; // [!code ++]
} & Env;
```

## 3. Create upload procedures

Add a router that generates presigned URLs for upload and retrieves files:

```ts
// apps/api/routers/upload.ts
import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc.js";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export const uploadRouter = router({
  /** Generate a presigned URL for direct client-to-R2 upload. */
  createPresignedUrl: protectedProcedure
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
      const key = `${ctx.session.activeOrganizationId}/${crypto.randomUUID()}/${input.filename}`;

      // R2 presigned URL via S3-compatible API
      const url = await ctx.env.UPLOADS.createMultipartUpload(key, {
        httpMetadata: { contentType: input.contentType },
      });

      return { key, uploadId: url.uploadId };
    }),

  /** Confirm upload and store metadata. */
  complete: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const object = await ctx.env.UPLOADS.head(input.key);
      if (!object) throw new Error("Object not found");
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
  // Get upload URL from the API
  const { key } = await trpcClient.upload.createPresignedUrl.mutate({
    filename: file.name,
    contentType: file.type,
    size: file.size,
  });

  // Upload directly to R2
  await fetch(`/api/uploads/${key}`, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  // Confirm and store metadata
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

Use an R2 binding to stream objects back to the client:

```ts
// apps/api/routes/uploads.ts (Hono route)
import { Hono } from "hono";

const uploads = new Hono();

uploads.get("/uploads/:key{.+}", async (c) => {
  const object = await c.env.UPLOADS.get(c.req.param("key"));
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

## Reference

* [Cloudflare R2 docs](https://developers.cloudflare.com/r2/) – bucket API, S3 compatibility, pricing
* [Security Checklist](/security/checklist) – file upload validation (type, size, content)
* [Add a tRPC Procedure](/recipes/new-procedure) – procedure patterns
* [Cloudflare Workers](/deployment/cloudflare) – wrangler bindings and secrets
