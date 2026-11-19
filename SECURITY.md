# Security and data handling

## Inquiry path

1. The browser posts JSON to the same-origin `/api/inquiries` endpoint. The Function requires POST, JSON, the request’s own Origin, the configured host and a body of at most 24 KiB. It enforces the byte limit while reading the stream.
2. The server validates field types, required values, maximum lengths, enumerated selections, email, optional phone, optional HTTP(S) website and affirmative consent. It rejects a filled honeypot, malformed reference and missing or oversized challenge token. The application never fetches a visitor’s website URL.
3. The Function sends the token and private secret to Cloudflare Siteverify. It requires a successful result with matching production hostname and the `assessment` action. Published test secrets are restricted to local loopback and bypass comparison with production hostname/action metadata only after Siteverify succeeds.
4. A bound, parameterized D1 statement inserts the inquiry and server-defined consent version. The client holds the same random UUID across retries within the form. A primary-key conflict acknowledges a retry only if the persisted fields match. A different payload gets a conflict and requires a fresh reference. There is no public record lookup.
5. A database error or verification failure produces an error response. The interface keeps the visitor’s values available and requests fresh verification for a retry. A receipt requires a confirmed write or matching existing row.

Turnstile and the honeypot limit basic automated submissions. The same-origin check and JSON-only requirement constrain browser requests. None of them is an identity or business-email verification service. New independent submissions can legitimately come from the same company. [Cloudflare server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) · [Cloudflare test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)

## Configuration

- `VITE_TURNSTILE_SITE_KEY` is public and embedded at build time. `TURNSTILE_SECRET_KEY` is a runtime secret, set in the production Pages environment. Keep real secrets out of all `VITE_` variables.
- The public site's origin and TURNSTILE_HOSTNAME must reflect the same final host. Production keys and the production D1 binding belong to the production environment only.
- The `_headers` file sets the static pages’ content security policy, frame restrictions, MIME protections, HTTPS policy and permissions. Only the Turnstile script and frame require a third-party origin. The Function returns JSON with `no-store` and `nosniff`.
- No advertising analytics, visitor tracking cookies or application-level IP logging are implemented. Cloudflare may process its own hosting and challenge telemetry. Never log raw inquiries, tokens or secrets.
- Real environment files, local D1 state, build outputs and local exports are ignored by Git. Fonts are self-hosted. Open-source notices are in `public/licenses`.

## Owner access and recovery

Use authenticated Cloudflare tools with appropriate account access and multifactor authentication. Follow [OWNER_GUIDE.md](OWNER_GUIDE.md) for inspection, exports, retention, deletion and the provider’s recovery window. If a credential is exposed, rotate it, update the encrypted environment setting, redeploy and repeat the receipt-to-database verification. Never ask a visitor to send their secret keys, account passwords or customer records through this form.

Changes to fields, disclosure, retention, providers or consent language require reviewing the privacy page and owner instructions together. Update the consent version when the contact permission changes. Treat production verification, access controls and legal approval as separate release checks.
