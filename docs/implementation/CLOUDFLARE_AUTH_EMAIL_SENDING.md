# Cloudflare Auth Email Sending — Implementation Document

## Overview

Connects the OTP authentication flow to Cloudflare Email Sending, replacing the
previous Resend-based implementation that was never operational in production
(no `RESEND_API_KEY` was configured).

The binding is named `EMAIL`. Sender is restricted to `account@somna.help`.

---

## 1. Architecture

```
POST /api/auth/request-code
  → validate request
  → apply rate limit (10/day, 60s cooldown)
  → generate 6-digit OTP
  → persist hashed challenge in D1 (otp_challenges)
  → send email via env.EMAIL.send()
  → provider accepts → return 200 success
  → provider rejects/fails → delete OTP challenge → return error
```

### Key design principles

- **Transactional success**: success response means the email provider accepted
  the message, not merely that the OTP row was written.
- **No secrets in code**: Cloudflare's native `send_email` binding handles
  authentication. No API key is stored in application code or environment vars.
- **Privacy-safe logging**: logs never include OTP codes, OTP hashes, full
  email addresses, message bodies, or Turnstile tokens.
- **No email enumeration**: the same generic "email send failed" error shape
  is returned regardless of whether the email exists; the UI uses generic
  phrasing ("We couldn't send the verification email").

---

## 2. Binding Configuration

### `wrangler.jsonc`

```jsonc
"send_email": [
  {
    "binding": "EMAIL",
    "allowed_destination_domains": ["*"],
  },
],
```

- **Binding name**: `EMAIL`
- **Sender**: `account@somna.help` (restricted at the Cloudflare Email Routing
  level; the application always specifies this address in the `from` field)

### TypeScript type

The `SendEmail` interface comes from `@cloudflare/workers-types`:

```typescript
import type { SendEmail } from "@cloudflare/workers-types";
```

Usage:

```typescript
interface AuthEnv {
  DB?: D1Database;
  EMAIL?: SendEmail;
}
```

---

## 3. Files Changed

### Backend

| File | Change |
|------|--------|
| `wrangler.jsonc` | Added `send_email` binding named `EMAIL` |
| `src/services/auth/auth-mailer.ts` | Rewritten: replaced Resend API with Cloudflare Email Sending binding |
| `src/services/auth/auth-api.ts` | Updated `AuthEnv` to include `EMAIL` binding; corrected success semantics; OTP rollback on failure; stable error codes; privacy-safe logs |
| `src/services/auth/auth-db.ts` | Added `deleteOTPChallenge()` for rollback |

### Frontend

| File | Change |
|------|--------|
| `src/components/AuthModal.tsx` | Added `ERROR_KEY_MAP` for server→content error code mapping; `email_send_failed` shows localized message |
| `src/content/en/auth/auth-copy.ts` | Added `emailSendFailed` to `AuthCopy` interface + content |
| `src/content/es/auth/auth-copy.ts` | Added `emailSendFailed` content (Spanish) |
| `src/content/pt-BR/auth/auth-copy.ts` | Added `emailSendFailed` content (Portuguese) |
| `src/content/pl/auth/auth-copy.ts` | Added `emailSendFailed` content (Polish) |

### Tests

| File | Coverage |
|------|----------|
| `src/services/auth/auth-mailer.test.ts` | 9 tests: binding call, sender/recipient/subject, text+HTML content, locale templates, all 4 error codes, privacy log checks |
| `src/services/auth/auth-api.test.ts` | 10 tests: success flow, call args, ordering, failure rollback, all error status codes, missing binding, rate limit/cooldown preserved, invalid email |
| `src/components/AuthModal.test.tsx` | 6 tests: success advancement, failure block, ES/PL localization, cooldown preserved, resend flow |

---

## 4. Stable Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `AUTH_EMAIL_NOT_CONFIGURED` | 503 | EMAIL binding not available in the Worker environment |
| `AUTH_EMAIL_REJECTED` | 400 | Provider rejected the message (bad recipient, policy violation) |
| `AUTH_EMAIL_UNAVAILABLE` | 503 | Provider is down or returning unexpected errors |
| `AUTH_EMAIL_RATE_LIMITED` | 429 | Provider rate limit hit |
| `AUTH_STORAGE_FAILED` | 500 | D1 insert failed during OTP creation |

The API response body includes both `error: "email_send_failed"` (generic) and
`code: "AUTH_EMAIL_*"` (specific stable code). The UI only uses the generic
form to avoid leaking provider internals.

---

## 5. Log Format

All log entries are single-line JSON with a stable schema:

```json
{
  "stage": "email_send",
  "provider": "cloudflare-email",
  "status": "accepted",
  "requestId": "CF-Ray-...",
  "recipient": "al...@example.com",
  "hasMessageId": true
}
```

On failure:

```json
{
  "stage": "email_send",
  "provider": "cloudflare-email",
  "status": "failed",
  "errorCode": "AUTH_EMAIL_UNAVAILABLE",
  "requestId": "CF-Ray-...",
  "recipient": "al...@example.com"
}
```

### Never logged

- OTP codes
- OTP hashes
- Full email addresses (only `lo...@domain.com` redacted form)
- Message bodies (text or HTML)
- Turnstile tokens
- Credentials or API keys

---

## 6. Frontend Behavior

- **Success path**: Only advances to the OTP entry screen when the server
  returns `success: true`. This means the email was accepted by the provider.
- **Failure path**: Shows a localized error toast ("We couldn't send the
  verification email. Please try again.") and stays on the email entry screen.
- **Resend**: Cooldown countdown and rate-limit behavior are preserved.
- **Localization**: All 4 supported locales (en, es, pt-BR, pl) have native
  content for the new error state.

---

## 7. Deployment Checklist

1. **Verify Email Sending is enabled** for `somna.help` in the Cloudflare
   dashboard (Email → Email Sending).
2. **Verify `account@somna.help`** is configured as a verified sender.
3. **Deploy the Worker**: `npx wrangler deploy`
4. **Confirm binding is present**: Check the Worker → Settings → Variables page
   for the `EMAIL` binding of type "Email Sending".
5. **Send a test OTP request** and verify:
   - Email arrives in the test inbox
   - Email Sending Activity Log shows the send
   - Worker logs show `status: "accepted"` with no sensitive data

---

## 8. What Was NOT Changed

- OTP hashing algorithm and pepper
- OTP expiry (10 minutes)
- Rate limiting (10/day, 60s cooldown)
- Verification semantics (5 attempts, code comparison)
- Session cookie format or lifetime
- Database schema (no new migrations needed)
