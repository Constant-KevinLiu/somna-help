import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { SHARE_IMAGE_HOSTING_ENABLED, shareImageUrl } from "./lib/share-config";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

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
}

interface ShareEnv {
  SHARE_BUCKET?: R2Bucket;
}

const UPLOAD_PATH = "/api/share-image";
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB cap on uploaded PNGs

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/**
 * Handle POST /api/share-image.
 *
 * Body: { "image": "<data-url or base64 PNG>", "filename": "<name>.png" }
 * Stores the PNG in R2 (binding SHARE_BUCKET) and returns its public URL.
 *
 * Returns 503 when R2 hosting is disabled or the bucket is not bound, so the
 * client can fall back to the "download image first" Pinterest workflow.
 */
async function handleShareImageUpload(request: Request, env: ShareEnv): Promise<Response> {
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

  // Accept either a data URL (data:image/png;base64,....) or raw base64.
  const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(image);
  const base64 = match ? match[1] : /^[A-Za-z0-9+/=]+$/.test(image) ? image : null;
  if (!base64) {
    return json(400, { ok: false, error: "invalid_image" });
  }

  let bytes: Uint8Array;
  try {
    // atob is available in the Workers runtime.
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
      if (url.pathname === UPLOAD_PATH) {
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
        const uploadResponse = await handleShareImageUpload(request, (env ?? {}) as ShareEnv);
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
