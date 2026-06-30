import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { SHARE_IMAGE_HOSTING_ENABLED, shareImageUrl } from "./lib/share-config";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

/**
 * Cloudflare R2 bucket configuration for Share Service v2.
 *
 * Bucket name: somna-share
 * S3 API endpoint: https://3d4f80a05f92c6244f8553442ae243e.r2.cloudflarestorage.com/somna-share
 * Public Development URL: https://pub-d4e88771abf4204879658307182abe9.r2.dev
 *
 * Setup steps for maintainers:
 *   1. Create bucket: wrangler r2 bucket create somna-share --location=wnam
 *   2. Enable public access on the bucket (r2.dev subdomain or custom domain).
 *   3. Bind the bucket in wrangler.jsonc as SHARE_BUCKET.
 *   4. Set PUBLIC_SHARE_BASE_URL to the public URL (custom domain or r2.dev).
 */

// Cloudflare Worker env shape for the share-image upload endpoint.
// Only the binding we use is declared; the rest of `env` is opaque.
// `R2Bucket` is normally provided by @cloudflare/workers-types; we declare a
// minimal structural type here so the project typechecks without that dep.
interface R2Bucket {
  put(
    key: string,
    value: BodyInit | ReadableStream | ArrayBuffer | ArrayBufferView,
    options?: {
      httpMetadata?: { contentType?: string; cacheControl?: string };
      customMetadata?: Record<string, string>;
    },
  ): Promise<unknown>;
  get(key: string): Promise<unknown>;
  delete(key: string): Promise<void>;
  head(key: string): Promise<unknown>;
}

interface ShareEnv {
  SHARE_BUCKET?: R2Bucket;
}

const LEGACY_UPLOAD_PATH = "/api/share-image";
const UPLOAD_PATH = "/api/share/upload";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB cap on uploaded PNGs

/**
 * Official Cloudflare R2 S3 API endpoint for the somna-share bucket.
 * Hardcoded per the Share Service v2 architecture diagram.
 * This private endpoint is used only inside the Worker and must never be
 * exposed to the client bundle.
 */
const R2_S3_ENDPOINT =
  "https://3d4f80a05f92c6244f8553442ae243e.r2.cloudflarestorage.com/somna-share";

/** Private S3 API endpoint pattern — must never be exposed to the client. */
const PRIVATE_R2_ENDPOINT = /r2\.cloudflarestorage\.com/i;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/** Validate server-side upload constraints: PNG only, <= 5MB, safe filename. */
function validateUpload(file: File, filename: string): { ok: true } | { ok: false; error: string } {
  if (file.type !== "image/png") {
    return { ok: false, error: "invalid_format" };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: "too_large" };
  }
  if (!/^[a-z0-9._-]+\.png$/i.test(filename)) {
    return { ok: false, error: "invalid_filename" };
  }
  if (PRIVATE_R2_ENDPOINT.test(filename)) {
    return { ok: false, error: "invalid_filename" };
  }
  return { ok: true };
}

/** Extract a stable user identity from the request for upload isolation. */
function getUserId(request: Request): string | null {
  const cookie = request.headers.get("cookie") || "";
  const match = /somna_uid=([^;]+)/.exec(cookie);
  return match?.[1] ?? null;
}

/** Standardize upload key format: {pageType}-{user-uuid}.png */
function buildUploadKey(filename: string, userId: string | null): string {
  const safeName = filename.replace(/[^a-z0-9._-]/gi, "");
  // Share Service v2 no longer requires an authenticated identity. Anonymous
  // users can still upload; using "anon" keeps keys namespaced and avoids
  // collisions with any future authenticated sessions.
  const identity = userId ? userId.slice(0, 12) : "anon";
  const base = safeName.replace(/\.png$/i, "");
  return `${base}-${identity}.png`;
}

/**
 * Handle POST /api/share/upload.
 *
 * Content-Type: multipart/form-data
 * Body: { file: PNG Binary Blob, filename: "dashboard-84-7.png" }
 *
 * Stores the PNG in R2 (binding SHARE_BUCKET) and returns its public URL.
 *
 * Returns 503 when R2 hosting is disabled or the bucket is not bound.
 */
async function handleShareUpload(request: Request, env: ShareEnv): Promise<Response> {
  if (!SHARE_IMAGE_HOSTING_ENABLED) {
    return json(503, {
      success: false,
      error: "hosting_disabled",
      message: "Share image hosting is not configured.",
    });
  }

  const bucket = env.SHARE_BUCKET;
  if (!bucket) {
    return json(503, {
      success: false,
      error: "bucket_not_bound",
      message: "R2 bucket is not bound to this worker.",
    });
  }

  const userId = getUserId(request) ?? "anon";

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { success: false, error: "invalid_form_data" });
  }

  const file = form.get("file");
  const requestedFilename = form.get("filename");

  if (!file || !(file instanceof File) || typeof requestedFilename !== "string") {
    return json(400, { success: false, error: "missing_fields" });
  }

  const validation = validateUpload(file, requestedFilename);
  if (!validation.ok) {
    return json(400, { success: false, error: validation.error });
  }

  const filename = buildUploadKey(requestedFilename, userId);

  // Deduplication: skip re-upload if the same key already exists.
  try {
    const existing = await bucket.head(filename);
    if (existing) {
      return json(200, {
        success: true,
        key: filename,
        url: shareImageUrl(filename),
        deduplicated: true,
      });
    }
  } catch {
    // Object does not exist — proceed with upload.
  }

  try {
    await bucket.put(filename, file, {
      httpMetadata: {
        contentType: "image/png",
        cacheControl: "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("R2 put failed:", err);
    return json(500, { success: false, error: "upload_failed" });
  }

  return json(200, {
    success: true,
    key: filename,
    url: shareImageUrl(filename),
  });
}

/**
 * Handle POST /api/share-image (legacy JSON endpoint).
 *
 * Body: { "image": "<data-url or base64 PNG>", "filename": "<name>.png" }
 * Kept for backward compatibility with existing ShareModal upload flow.
 */
async function handleLegacyShareImageUpload(request: Request, env: ShareEnv): Promise<Response> {
  if (!SHARE_IMAGE_HOSTING_ENABLED) {
    return json(503, {
      ok: false,
      error: "hosting_disabled",
      message: "Share image hosting is not configured.",
    });
  }

  const bucket = env.SHARE_BUCKET;
  if (!bucket) {
    return json(503, {
      ok: false,
      error: "bucket_not_bound",
      message: "R2 bucket is not bound to this worker.",
    });
  }

  let payload: { image?: string; filename?: string };
  try {
    payload = (await request.json()) as { image?: string; filename?: string };
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  const image = payload.image;
  const filename = payload.filename;
  if (!image || !filename || !/^[a-z0-9._-]+\.png$/i.test(filename)) {
    return json(400, { ok: false, error: "invalid_payload" });
  }

  const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(image);
  const base64 = match ? match[1] : /^[A-Za-z0-9+/=]+$/.test(image) ? image : null;
  if (!base64) {
    return json(400, { ok: false, error: "invalid_image" });
  }

  let bytes: Uint8Array;
  try {
    const binary = atob(base64);
    bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  } catch {
    return json(400, { ok: false, error: "invalid_base64" });
  }

  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    return json(413, { ok: false, error: "too_large" });
  }

  try {
    await bucket.put(filename, bytes, {
      httpMetadata: {
        contentType: "image/png",
        cacheControl: "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("R2 put failed:", err);
    return json(500, { ok: false, error: "upload_failed" });
  }

  return json(200, { ok: true, url: shareImageUrl(filename) });
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // Intercept the share-image upload API before handing off to TanStack
      // Start. This gives us direct access to the R2 binding on `env` and
      // avoids server-function serialization for a raw binary upload.
      const url = new URL(request.url);
      if (url.pathname === UPLOAD_PATH || url.pathname === LEGACY_UPLOAD_PATH) {
        if (request.method === "OPTIONS") {
          return new Response(null, {
            status: 204,
            headers: {
              "access-control-allow-origin": "*",
              "access-control-allow-methods": "POST, OPTIONS",
              "access-control-allow-headers": "content-type",
            },
          });
        }
        if (request.method !== "POST") {
          return json(405, { ok: false, error: "method_not_allowed" });
        }
        const handler =
          url.pathname === UPLOAD_PATH ? handleShareUpload : handleLegacyShareImageUpload;
        const uploadResponse = await handler(request, (env ?? {}) as ShareEnv);
        uploadResponse.headers.set("access-control-allow-origin", "*");
        return uploadResponse;
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
