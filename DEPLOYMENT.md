# Launch on Cloudflare Pages

Start with the local site and tests in [README.md](README.md). The following steps create a real hosting environment. Use the Berveuda owner’s GitHub and Cloudflare accounts and a Cloudflare **Free** account for this site. The owner approved public release, the Privacy Policy, Terms of Use and the 90-day retention period on November 19, 2026. Track live setup and verification in the [launch checklist](LAUNCH_CHECKLIST.md).

## Current production configuration

The Pages project is `berveuda-ai`. Its permanent address is [berveuda-ai.pages.dev](https://berveuda-ai.pages.dev/). It builds `main` from `berveuda/berveuda-ai-website.`. The production database is `berveuda-inquiries` and the widget is named `Berveuda AI assessments`. Use the existing resources for updates. Steps 1–5 explain how to reproduce this configuration from an empty account.

## 1. Put the website source in GitHub

The owner selected the public [Berveuda AI website repository](https://github.com/berveuda/berveuda-ai-website.). The repository name ends with a period. Use that repository in the Pages GitHub picker. The following creation instructions are for setting up a separate copy from scratch.

1. On GitHub, select **+ → New repository**, choose the owner, enter `berveuda-ai-site`, and select **Private**. Leave the README, .gitignore and license options empty. Click **Create repository**. An existing empty repository owned by Berveuda also works.
2. Copy its HTTPS URL from **Quick setup**. In Windows File Explorer, open the `berveuda-ai-site` folder, type `powershell` into its address bar and press Enter. Run `git status` to see the state of this website repository. If the site has yet to be initialized, run `git init -b main` from this folder.
3. If files still need a commit, run `git add -- .`, then `git diff --cached --name-only`. The list should contain the app, `functions`, `migrations`, guides, public assets and package lock. Keep real `.env*` and `.dev.vars` files, database files, lead exports and `node_modules` out of Git. Commit the reviewed changes with `git commit -m "Prepare Berveuda AI website"`.
4. Run `git remote -v`. If there is no `origin`, type `git remote add origin `, paste the URL you copied, and press Enter. If an origin already exists, check that it is the intended repository. Run `git branch --show-current`. For this initial upload from the release branch, run `git push -u origin HEAD:main`. Complete the GitHub sign-in prompt and confirm the files are visible in the private repository. [GitHub’s Windows import guide](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github?platform=windows)

## 2. Create and initialize the lead database

1. Sign in to the Cloudflare dashboard and select the Berveuda account. Open **Storage & Databases → D1 SQL Database → Create Database**. Enter `berveuda-inquiries` and click **Create**. [D1 setup](https://developers.cloudflare.com/d1/get-started/)
2. Select the new database, then **Console**. In PowerShell, inside the website folder, run `Get-Content -Raw -LiteralPath '.\migrations\0001_inquiries.sql' | Set-Clipboard`. Paste into **Console**, confirm the selected database name, and click **Execute**. Apply this initial schema to the new empty database once. This dashboard procedure uses the SQL file directly. Record the filename and application date in your private release notes so future migrations can follow in order.
3. Run `PRAGMA table_info(inquiries);` in the same console. Check the column names against the migration, then run `SELECT COUNT(*) AS inquiries FROM inquiries;`. A new database should show zero. Keep local and test submissions in the local database. [D1 dashboard SQL console](https://developers.cloudflare.com/d1/get-started/)

## 3. Connect Pages to the repository

The owner’s public release authorization is recorded in the launch checklist. The **Save and Deploy** button starts a build, and later pushes to the production branch can automatically publish updates. A private GitHub repository still produces a publicly accessible Pages website. [Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)

1. In **Workers & Pages**, click **Create application → Pages → Connect to Git** (some views say **Import an existing Git repository**). Choose **GitHub**. In the GitHub authorization window, select **Only select repositories**, choose `berveuda-ai-site`, and click **Install & Authorize**. Back in Cloudflare, select the repository and click **Begin setup**.
2. Pick an available project name. Its assigned hostname will usually be `PROJECT.pages.dev`, with your project name in place of `PROJECT`. Use the **actual** hostname Cloudflare shows for the following steps. The permanent production address has no branch name or deployment hash.
3. Use these settings for the release build.

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | `None` with the explicit build and output values below |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | Leave blank when this project is the repository root |

4. If the setup wizard requires **Save and Deploy** before it exposes **Bindings**, use `node -e "process.exit(1)"` as the **initial build command**. This creates the project and deliberately stops the first build before it publishes an unconfigured site. Open the new project from **Workers & Pages** and configure steps 4 and 5. Restore `npm run build` under **Settings → Builds** before starting the release build. If the dashboard offers all settings before the first deploy, configure them directly and use the normal build command. [Build settings](https://developers.cloudflare.com/pages/get-started/git-integration/) · [Pages build image](https://developers.cloudflare.com/pages/configuration/build-image/)

## 4. Register a production Turnstile widget

1. In Cloudflare, open **Turnstile → Add widget**. Name it `Berveuda AI assessments`. Choose **Rest of World** for the US audience, and enter the exact production Pages hostname in **Hostname management** (no scheme, slash or path). Choose **Managed** mode. Leave **Pre-clearance** off and click **Create**.
2. Copy the public **sitekey** and store the **secret key** in your password manager. Production requires this widget’s matching key pair. Test keys belong only in isolated local testing. [Create a widget](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/) · [Test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)

## 5. Connect the production environment

Under **Workers & Pages → your Pages project → Settings**, select the **Production** environment. Use these exact names and spellings. The hostname below is the same one you allowed in Turnstile.

| Setting | Control and value |
| --- | --- |
| `DB` | **Bindings → Add → D1 database**. Set **Variable name** to `DB` and choose `berveuda-inquiries`. Save. |
| `VITE_TURNSTILE_SITE_KEY` | **Variables and Secrets → Add**. Choose **Text** and paste the widget’s public sitekey. This value is embedded at build time. |
| `SITE_URL` | Add a **Text** variable with the production HTTPS origin, e.g. `https://YOUR-PROJECT.pages.dev` using the actual name and no trailing slash. The build uses it for share and search metadata. |
| `TURNSTILE_HOSTNAME` | Add a **Text** variable with the actual host alone, e.g. `YOUR-PROJECT.pages.dev`. The Function checks the verification response against it. |
| `TURNSTILE_SECRET_KEY` | Add as **Secret** (or select **Encrypt**), paste the matching private Turnstile key and save. This name deliberately has no `VITE_` prefix. |

The Pages dashboard owns production settings. Restrict production bindings and values to Production. In **Preview**, leave `SITE_URL` unset and keep the production database and widget secrets out. If branch previews are unnecessary, select **Settings → Builds → Branch control**, and set preview branches to **None**. For an authorized staging test, use a separate D1 database, its own migration and widget, and the exact allowed staging hostname. Test data belongs to that staging database. Every preview deployment normally gets `X-Robots-Tag: noindex`. Anyone with the address may still be able to view it unless preview access protection is enabled. [Pages environment bindings and secrets](https://developers.cloudflare.com/pages/functions/bindings/) · [Preview visibility](https://developers.cloudflare.com/pages/configuration/preview-deployments/)

Set the production build command to `npm run build`. In **Deployments**, retry the production deployment for the approved commit, or push the approved release commit to `main`. Wait for **Success**, open **View details**, and copy the **production** HTTPS address. Editing variables or bindings requires a fresh deployment. [Pages Git deployment](https://developers.cloudflare.com/pages/get-started/git-integration/) · [Pages D1 bindings](https://developers.cloudflare.com/pages/functions/bindings/)

## 6. Verify the public release

1. From a private browser window, open the production address. Follow each header and footer link, reload a detail page directly, check the mobile menu, and open a made-up path. The last request should return the branded 404 and HTTP status 404. Use `curl.exe -I` followed by the full URL to see HTTP status and headers.
2. Open `/robots.txt` and `/sitemap.xml` on the production host. Confirm sitemap URLs use the production origin. Open the homepage source and check its canonical URL, page title, description and social image URL. Confirm that the image loads over HTTPS.
3. In a normal browser, use **Request an Automation Assessment** on the production host. Use the owner’s controlled business email, a unique marker such as `Launch check YYYY-MM-DD HHMM` in **Business name**, and clearly labeled test details. Check the consent box, complete the real widget and submit once. Keep the confirmation and submission time for the next step.
4. In **D1 → berveuda-inquiries → Console**, use the query below. Match the exact marker, submit time, email and consent version. A single matching row plus the visible confirmation verifies the full path. Record only the deployment commit, host, result and time in the launch checklist. Remove the test row using the ID-specific procedure in [OWNER_GUIDE.md](OWNER_GUIDE.md).

   ```sql
   SELECT id, created_at, business_name, email, consent_version
   FROM inquiries
   WHERE business_name = 'Launch check YYYY-MM-DD HHMM'
   ORDER BY created_at DESC;
   ```

5. If the row is missing, keep lead capture marked unverified. Check you used the permanent production URL, deployed the latest settings and queried the `DB` database bound to that deployment. Widget errors usually warrant checking widget hostname, sitekey, action configuration and matching secret. Database errors warrant checking the binding and migration. Use the Function’s response status and Cloudflare dashboard diagnostics without copying visitor details or secret keys into support conversations. [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## 7. Update or move the site

For each update, run the local checks in `README.md`, commit the change to a branch and review its diff. Merging to `main` triggers the next production deployment when automatic deployments are enabled. Open **Deployments** and verify its commit and critical paths. For a schema change, review its migration first and coordinate the application release with the new schema. A Pages rollback to an earlier build affects site code only. [Pages Git settings](https://developers.cloudflare.com/pages/configuration/git-integration/)

For a domain you already own, select **your Pages project → Custom domains → Set up a domain**. Enter the desired name and follow Cloudflare’s DNS instructions. A root domain typically requires a Cloudflare zone and Cloudflare nameservers. For an externally managed subdomain, associate it in Pages first, then create the requested CNAME at your DNS provider. Keep existing mail and other DNS records in place. Wait for **Active** and working HTTPS. Add that exact host to the widget, change `SITE_URL` and `TURNSTILE_HOSTNAME` to the new origin and hostname respectively, and redeploy. Configure a permanent redirect from the production `pages.dev` host to the custom origin, preserving paths and query strings. Check both addresses and repeat the production form and D1 test on the new host. [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) · [Redirect the Pages subdomain](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)

## Free-tier capacity

Cloudflare lists 500 Pages builds per month and 100,000 Workers/Pages Functions requests per day on its Free plan. Static requests that bypass Functions are free. Free D1 permits 5 million rows read and 100,000 rows written per day, with 500 MB per database and 5 GB total account storage. Free Turnstile includes up to 20 widgets. These limits can change and some are shared across projects. Check account usage if the form reports temporary failures. Keep paid upgrades disabled for the $0 launch. [Pages limits](https://developers.cloudflare.com/pages/platform/limits/) · [Functions quotas](https://developers.cloudflare.com/pages/functions/pricing/) · [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) · [D1 limits](https://developers.cloudflare.com/d1/platform/limits/) · [Turnstile plans](https://developers.cloudflare.com/turnstile/plans/)
