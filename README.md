# Berveuda AI website

A React and TypeScript website for US industrial service contractors. Visitors can explore four automation services, step through a quote recovery example, and request an assessment. The assessment endpoint verifies Cloudflare Turnstile and persists accepted submissions in D1. The source and local database work independently of the other Berveuda projects.

## Open the local website on Windows

From this project folder, type `powershell` in File Explorer’s address bar and press Enter. Use Node.js 24 LTS or the newer compatible Node already installed on this machine.

For a fresh copy, run these commands once. The example files contain Cloudflare’s published **test** credentials. Leave existing local configuration files in place.

```powershell
npm.cmd ci
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
if (!(Test-Path .dev.vars)) { Copy-Item .dev.vars.example .dev.vars }
npm.cmd run db:local
```

Build and run the full website, including the real local lead endpoint.

```powershell
npm.cmd run build
npm.cmd run start:local
```

Open [the local website](http://127.0.0.1:8788). Keep the terminal open while using it. Press Ctrl+C in that terminal to stop it. Rebuild after editing the source. For frontend-only hot reload, `npm.cmd run dev` runs Vite. Use the Wrangler address above for form submissions, direct-page status codes and SEO checks.

## Check the work

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd run test:browser
```

Run `db:local` and copy both example files before browser tests on a fresh checkout. Playwright starts the loopback Pages runtime or reuses it if already running. The tests use Cloudflare’s official test widget and Siteverify over the network with fictional inquiry data. Test records are checked in the same local D1 database and removed by their specific reference. The local state and test output are ignored by Git. This workspace is under OneDrive, so use fictional data for local testing.

## Find the right file

| Task | Location |
| --- | --- |
| Edit public content and workflow descriptions | `src/content.ts`, `src/Home.tsx`, `src/Pages.tsx` |
| Review legal wording | Privacy and Terms in `src/Pages.tsx`, served at `/privacy` and `/terms` |
| Change the assessment form or validation | `src/Contact.tsx`, `src/Verification.tsx`, `shared/inquiry.ts` |
| Inspect the write path or table | `functions/api/inquiries.ts`, `migrations/0001_inquiries.sql` |
| Adjust branding or imagery | `src/brand.tsx`, `src/style.css`, `public/images/`, [imagery notes](docs/IMAGERY.md) |
| Configure the public origin and search metadata | `scripts/prerender.mjs`, `.env.example` |
| Review security and failure behavior | [Security](SECURITY.md) |
| Set up GitHub, Cloudflare and Turnstile | [Deployment](DEPLOYMENT.md) |
| Find, export or delete a lead | [Owner guide](OWNER_GUIDE.md) |
| Review completed checks and outstanding approvals | [Launch checklist](LAUNCH_CHECKLIST.md) |

## How pages and forms are served

The build writes an HTML document for each public route plus a branded `404.html`. Normal links load those documents directly. React hydrates them for the mobile menu, workflow explorer and inquiry form. Direct visits and search crawlers get page content, headings and metadata in the first HTML response. The public build uses `SITE_URL` to create canonical URLs and populate the sitemap. Local builds disable indexing and emit an empty sitemap until there is a final origin.

Only `/api/inquiries` invokes a Pages Function. Other routes are static. The local JSONC file configures a fictional D1 identifier for local database commands. Production D1, Turnstile and the public domain are configured in the Cloudflare dashboard. The website has no lead inbox or notification subscription. Use the authenticated D1 Console to check inquiries.

## Release status

The local build and verification record are in [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md). The owner approved public deployment, the Privacy Policy, Terms of Use and 90-day retention on November 19, 2026. Production verification requires the connected GitHub repository, Cloudflare account and a live inquiry receipt. No verified public address has been assigned to this checkout.
