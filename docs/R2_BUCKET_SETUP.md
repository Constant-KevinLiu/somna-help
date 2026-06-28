# R2 Bucket Setup — `somna-share`

This guide walks through creating the Cloudflare R2 bucket used by Share Service v2.

## Official settings (from architecture diagram)

| Setting                 | Value                                                                          |
| ----------------------- | ------------------------------------------------------------------------------ |
| Bucket name             | `somna-share`                                                                  |
| Region / location hint  | `WNAM` (Western North America)                                                 |
| Public Development URL  | `https://pub-d4e88771abf4204879658307182abe9.r2.dev`                           |
| Private S3 API endpoint | `https://3d4f80a05f92c6244f8553442ae243e.r2.cloudflarestorage.com/somna-share` |

## Step-by-step setup

1. **Install / authenticate Wrangler** (if not already done):

   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **Create the bucket** with the WNAM location hint:

   ```bash
   wrangler r2 bucket create somna-share --location=wnam
   ```

3. **Enable Public Development URL** for the bucket:

   ```bash
   wrangler r2 bucket dev-url enable somna-share
   ```

   This exposes the bucket under the `*.r2.dev` subdomain shown above.

4. **Bind the bucket in `wrangler.jsonc`**:

   The binding is already present in the project:

   ```jsonc
   "r2_buckets": [
     {
       "binding": "SHARE_BUCKET",
       "bucket_name": "somna-share"
     }
   ]
   ```

5. **Set the public base URL** in your environment:

   Create a `.env` file in the project root with:

   ```bash
   PUBLIC_SHARE_BASE_URL=https://pub-d4e88771abf4204879658307182abe9.r2.dev
   ```

   When the production custom domain is ready, replace it with:

   ```bash
   PUBLIC_SHARE_BASE_URL=https://share.somna.help
   ```

   No business code changes are required to switch domains.

6. **Deploy / restart**:

   ```bash
   wrangler deploy
   # or for local dev
   npm run dev
   ```

## Verification

- Upload a test PNG through the ShareModal Pinterest flow.
- Confirm the returned URL starts with the public R2 dev URL.
- Open the URL in a browser and verify the image loads.
- Search the frontend build output for `.r2.cloudflarestorage.com` — expect zero matches.
