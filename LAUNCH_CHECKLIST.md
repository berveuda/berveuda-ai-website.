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

- [ ] Connect Cloudflare Pages to the selected GitHub repository and confirm the production build commit.
- [ ] Confirm the assigned HTTPS hostname, D1 binding, real Turnstile configuration and origin-based SEO metadata.
- [ ] Check all public routes, navigation, mobile layout, branded 404 status, static assets and metadata on the public site.
- [ ] Submit a live inquiry through real Turnstile, match its receipt in authenticated production D1 and remove the labeled test row.
- [ ] Record the verified public URL, deployment commit and date.

The owner checks D1 directly for new inquiries and carries out the 90-day retention policy. Automated accessibility scans supplement keyboard and visual checks. They do not establish a WCAG certification.
