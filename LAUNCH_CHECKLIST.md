# Berveuda AI launch checklist

## Completed on November 19, 2026

- [x] Build and prerender eight public pages and a branded HTTP 404.
- [x] Add original branding, responsive boiler imagery, mobile navigation, assessment form, workflow explorer and FAQs.
- [x] Implement Pages Functions, server-side validation, Turnstile, D1 persistence and duplicate safeguards.
- [x] Run the production compilation, frontend and Function TypeScript checks, ESLint and six unit tests.
- [x] Pass ten Chromium browser tests. Coverage includes 320, 390, 768 and 1440px layouts, route statuses, links, keyboard controls, automated accessibility checks, a first submission and a lost-reply retry.
- [x] Verify actual test-widget submissions through Cloudflare Siteverify and a local D1 binding. Observe a genuine receipt, check the stored row and confirm a retry returns the original reference.
- [x] Verify fail-closed handling for invalid fields, consent, challenge rejection, configuration and database failures. Production hostname/action checks were exercised using controlled unit responses.
- [x] Write the deployment, security and owner guides.
- [x] Owner approved Privacy, Terms, manual 90-day retention and public deployment.
- [x] Owner selected the public GitHub repository `berveuda/berveuda-ai-website.`.
- [x] Authenticate Cloudflare, create `berveuda-inquiries`, apply the migration, verify the empty production table and create a managed Turnstile widget.

## Production acceptance

- [x] Connect Cloudflare Pages to GitHub. The production build from `33f6aeed7c1ea14f8012b58dc8f7170899f088c7` deployed successfully.
- [x] Confirm HTTPS, production D1 binding, managed Turnstile widget, final origin, canonical tags and all eight sitemap URLs.
- [x] Check eight public pages, branded 404 status, 21 distinct internal destinations, mobile navigation, interactive workflow controls, static assets, headers and metadata on the live site. The live endpoint rejected a submission missing verification.
- [x] Submit a live inquiry through real managed Turnstile. The production UI receipt matched exactly one row in authenticated production D1 on November 19, 2026 at 20:34 UTC. Confirm the consent version, delete only that labeled test row and verify zero matching rows remain.
- [x] Public address verified on November 19, 2026 at [berveuda-ai.pages.dev](https://berveuda-ai.pages.dev/). Deployment ID `3ee547a2-db76-4ec9-8a2b-8b5f0b642b41`.

The owner checks D1 directly for new inquiries and carries out the 90-day retention policy. Automated accessibility scans supplement keyboard and visual checks. They do not establish a WCAG certification.
