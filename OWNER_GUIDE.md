# Working with assessment inquiries

Successful submissions go to the `inquiries` table in Cloudflare D1. The owner checks this database directly. Email notifications, a CRM sync and a public lead viewer are outside the current setup. The website only accepts an inquiry after the server validates the submission, verifies the Turnstile token and confirms the database operation.

## Check for new inquiries

1. Sign in to the account that owns the live Pages project. Open **Storage & Databases → D1 SQL Database → berveuda-inquiries → Console**. Use the Cloudflare account’s multifactor authentication and limit D1 access to people responsible for inquiries. [D1 dashboard and Console](https://developers.cloudflare.com/d1/get-started/)
2. Paste the following SQL, then click **Execute**. The newest records appear first, with UTC timestamps. Use the result’s `id` to look up one submission. The `id` is the inquiry’s unique reference.

   ```sql
   SELECT id, created_at, business_name, full_name, industry, challenge
   FROM inquiries
   ORDER BY created_at DESC, id DESC
   LIMIT 50;
   ```

3. To read a specific entry, replace the sample text between the quotes with the ID from step 2. If you need more than the newest 50 entries, find a particular day using `WHERE created_at >= '2026-11-19' AND created_at < '2026-11-20'` before `ORDER BY`, and change the dates as needed.

   ```sql
   SELECT id, created_at, full_name, business_name, email, phone, industry,
          website, challenge, details, consent_version
   FROM inquiries
   WHERE id = 'PASTE-THE-INQUIRY-ID';
   ```

4. Pick a regular time each business day to check the list. Reply using your approved business channel and only about the inquiry the visitor consented to. The site does not send a reply or mark rows as contacted. If tracking follow-up elsewhere, record the minimum needed and keep that second copy in your retention process.

## Export a private copy when needed

Cloudflare’s authenticated Wrangler tool can export the `inquiries` table to a SQL file. This includes contact details and inquiry text. The example writes to your Windows user’s local AppData folder, outside the project and the usual OneDrive folders. Use a trusted device with appropriate disk protection and keep access restricted to the account owner. [Cloudflare D1 exports](https://developers.cloudflare.com/d1/best-practices/import-export-data/)

1. From the website project folder, open PowerShell. Install the locked development tools with `npm.cmd ci` if needed. Run `npx.cmd wrangler login`, approve sign-in in your browser, and run `npx.cmd wrangler whoami`. Confirm it shows the account which owns `berveuda-inquiries`. If you belong to multiple accounts, set `$env:CLOUDFLARE_ACCOUNT_ID` to the ID displayed for the correct account in that PowerShell session.
2. Run the following commands. The timestamped filename makes it easier to identify copies for deletion. `--remote` targets the live database.

   ```powershell
   $exportFolder = Join-Path $env:LOCALAPPDATA 'Berveuda\PrivateExports'
   New-Item -ItemType Directory -Force -Path $exportFolder | Out-Null
   $exportStamp = Get-Date -Format 'yyyyMMdd-HHmmss'
   $exportPath = Join-Path $exportFolder "inquiries-$exportStamp.sql"
   npx.cmd wrangler d1 export berveuda-inquiries --remote --table=inquiries --output="$exportPath"
   if ($LASTEXITCODE -eq 0) { Get-Item -LiteralPath $exportPath | Select-Object FullName,Length }
   ```

3. Check that Wrangler reported success and the file has content. The file is readable text containing SQL and lead data. Keep it out of Git, synced project folders, chat transcripts and email attachments. Record the private file’s location and deletion date in your own record of exports. Remove it, including any additional copies, when its purpose is finished.

## Retention and privacy requests

The owner approved a **90-day retention period from receipt** on November 19, 2026. The application has no scheduled purge. Review expiry and delete expired records daily, including days without new inquiries. The work below applies to the live D1 table and each private export you created.

To find records past the approved period, run the following read-only query in the production D1 Console. The comparison uses SQLite UTC timestamps. Change the interval if you publish a different policy.

```sql
SELECT id, created_at, business_name
FROM inquiries
WHERE created_at <= datetime('now', '-90 days')
ORDER BY created_at;
```

For a privacy request received through the contact form, privately confirm the requester’s identity using the business email already associated with the inquiry. Use a separately confirmed method if the requester has lost that mailbox. Avoid disclosing other entries or asking for unnecessary identity documents. Follow the approved policy and any applicable obligations. Remove the request’s own inquiry record when its purpose is finished.

### Delete one reviewed record

1. Run the ID-specific `SELECT` in **Check for new inquiries**. Confirm the correct production database and the exact row, and verify that removal is authorized. Deletion changes the production database immediately.
2. Enter this command with the reviewed ID and click **Execute**. Keep the `WHERE id =` condition.

   ```sql
   DELETE FROM inquiries WHERE id = 'PASTE-THE-REVIEWED-INQUIRY-ID';
   ```

3. Verify the result using the same ID. A count of zero confirms removal from the active table.

   ```sql
   SELECT COUNT(*) AS remaining
   FROM inquiries WHERE id = 'PASTE-THE-REVIEWED-INQUIRY-ID';
   ```

4. Review export locations and follow-up records. Delete obsolete exports containing the removed record. Recreate a smaller export from current data only when needed. Record the date, action and outcome with minimal identifying data in a private record.

Cloudflare D1 includes automatic point-in-time recovery. Its Free plan currently keeps up to seven days of history. A deleted record can remain in that recovery window and in any copies the owner keeps. A restore affects the entire database and may reintroduce previously deleted inquiries. Before restoring, consider intervening submissions and deletions, preserve what you need, and plan to reconcile both afterward. [D1 Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/) · [Free-plan recovery window](https://developers.cloudflare.com/d1/platform/limits/)

## If inquiries stop arriving

Open the production form in a normal browser, submit one clearly labeled owner test, and check the database following [the production verification procedure](DEPLOYMENT.md#6-verify-the-public-release). If verification fails, check **Pages → Settings** for the live hostname, matching widget key pair and `DB` binding, then check the most recent deployment’s commit. For missing tables, follow the initial schema instructions for the intended empty database. If Cloudflare reports a daily quota, inspect Workers and D1 usage in the owner’s account. Keep the inquiry fields and challenge tokens out of diagnostic logs. If a secret was exposed, rotate it in Turnstile, update the encrypted production setting, redeploy and repeat the end-to-end check. [Turnstile secret rotation](https://developers.cloudflare.com/turnstile/troubleshooting/rotate-secret-key/)
