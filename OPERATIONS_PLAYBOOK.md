# BringMyBite — Operations Playbook

Last checked: 22 October 2026. Prepared from repository and cloud configuration metadata. This is a runbook, not a claim that every live user flow has passed end-to-end testing.

## 1. Two-site map

| Purpose | GitHub repository | Vercel project | Current public address | Data store |
|---|---|---|---|---|
| Main food ordering, subscriptions and operations website | [bringmybite](https://github.com/rnsingh28rs-arch/bringmybite) | bringmybite | [bringmybite.com](https://bringmybite.com) (verified; apex redirects to www) | Supabase project bring-my-bite, ref tknmdgeikmlsprqppukf |
| Google/AI tools website | [google.bringmybite](https://github.com/rnsingh28rs-arch/google.bringmybite) | google.bringmybite | [googlebringmybite.vercel.app](https://googlebringmybite.vercel.app) | Storage is not confirmed production-ready; code has a Google Tool Finder Supabase fallback, but Vercel has no Supabase URL/key variables in the current read-only listing |

**Important domain gap:** the requested custom address google.bringmybite.com was not attached to the google.bringmybite Vercel project during this check. Add it under that project's Settings → Domains, then follow the exact DNS instructions shown by Vercel. Do not guess DNS records and do not remove bringmybite.com from the main project.

**Database names:** the current main website is configured for bring-my-bite. The separate bring-my-bite-v2 project contains 62 tables / 14 migrations but had zero rows in public tables and is not the main website's current configured database. Do not switch production to v2, run destructive schema commands, or delete it without a final explicit instruction and a dependency check. The Google Tool Finder Supabase project is a different project; do not mix the website databases.

## 2. Before inviting marketing traffic

### Main website: bringmybite.com
- Open the homepage on desktop and a phone.
- Test a subscription/registration flow without taking a real payment.
- Sign in to the authorized admin route and confirm the menu, banners, pricing and payment display load.
- Change one harmless CMS value, refresh, and confirm it persists; restore the original value.
- In Supabase, confirm the test record landed in the intended bring-my-bite project.
- Never publish, email or share customer CSV exports outside authorized staff.

### Google website
- Until the domain is attached and verified, use the Vercel address; do not tell visitors google.bringmybite.com is live yet.
- Confirm the admin console can sign in, a contact form accepts a test enquiry, and the enquiry can be found after a fresh request/session.
- Current Vercel environment-variable names included GEMINI_API_KEY, GEMINI_MODEL, RESEND_API_KEY, CONTACT_TO_EMAIL and ADMIN_PASSWORD. Supabase connection variables were not present in the current listing. The API can fall back to local JSON, which is not a safe durable store for a serverless production website. Before paid campaigns, connect the intended database, apply data/schema.sql to that database only after confirming it is the correct empty target, set server-side SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, redeploy, and verify persistence. Never place a service-role key in a VITE_ or NEXT_PUBLIC_ variable.
- Send a real email test only after confirming sender-domain verification and recipient settings.

### Spreadsheet limitation
The main site's current admin code exports subscription/customer records to CSV, which Excel can open. It does not provide an XLSX/Excel import workflow. The Google site also has no confirmed one-click spreadsheet import. See EXCEL_IMPORT_EXPORT.md before promising bulk import to anyone.

## 3. Local commands (Windows PowerShell)

Run commands inside the correct repository folder. Node.js LTS should be installed.

### Main site repository: bringmybite
    npm ci
    npm run dev
    npm run lint
    npm test
    npm run build
    npm run preview

Development server: http://localhost:3000. The build script runs the CMS pricing/menu sync scripts, generates PWA icons, builds Vite assets and generates SEO pages. Review the Git diff after a build if any generated files changed.

### Google site repository: google.bringmybite
    npm ci
    npm run dev
    npm run lint
    npm test
    npm run build
    npm run preview

Development server: http://localhost:3000. The test command runs scripts/test-all.ts. For deeper release checks, inspect scripts/verify-production-readiness.ts and scripts/chrome-e2e.ts and ensure required test dependencies/configuration exist.

Use Ctrl+C to stop a local development server.

## 4. Safe Git + Vercel release routine

Do not edit production directly. From the appropriate repository:

    git status
    git pull origin main
    git checkout -b fix/short-description
    npm ci
    npm run lint
    npm test
    npm run build
    git status
    git diff

Then commit and push the branch:

    git add .
    git commit -m "Describe the change"
    git push -u origin fix/short-description

Review the diff and test a Vercel Preview deployment. Merge to main only after the preview and checks pass. The connected Vercel projects use GitHub repositories; pushes/merges can trigger builds automatically. A push to main may publish production—never use it just to test. After production deployment, open both the home page and the changed feature and verify the actual live result.

## 5. Environment configuration safety

- Configure variables in Vercel → Project → Settings → Environment Variables. Select Production (and Preview only if needed); redeploy after changing variables.
- Main site browser config expects VITE_SUPABASE_URL and a publishable/anonymous key. The client code supports VITE_SUPABASE_PUBLISHABLE_KEY first and VITE_SUPABASE_ANON_KEY as a fallback. These are browser values and must have suitable RLS policies.
- Google site's database key must stay server-side. Use the secret name SUPABASE_SERVICE_ROLE_KEY only in API/server runtime; never prefix it with VITE_ or NEXT_PUBLIC_.
- Keep .env, .env.local, passwords, service-role keys, Gemini keys, Resend keys and customer exports out of Git. Never paste actual secrets into this document, chat, screenshots or a public issue.
- Do not run supabase/schema.sql blindly against the main production database. Main project already has data and migrations. Back up first and use a reviewed, narrow migration for a specific change.
- Both GitHub repositories were public at the time of the check. Treat all committed content as public and ensure no secrets/customer records are committed.

## 6. Reusable prompts for Antigravity / a coding agent

### Routine change
"Work in the existing repository and preserve unrelated behavior. First inspect the current implementation and tests. Make the smallest maintainable change, run the repo's lint, tests and production build, inspect the diff, and report exact results. Do not deploy or merge to main unless I explicitly authorize it. Never invent test results."

### Excel/CSV import feature
"Inspect the target table schema, RLS, types and current admin workflow before coding. Add a secure admin-only CSV/XLSX import with a sample template, column mapping, preview, required-field/type validation, duplicate detection, row-level error report, and safe transaction/rollback behavior. Use the authoritative database, not browser localStorage or an untrusted public key for privileged writes. Add tests for valid rows, bad rows, duplicates, permissions, and database failure. Do not say import is available until it is built and verified end-to-end."

### Production bug / urgent repair
"Reproduce the issue first. Trace it from UI through API/storage and identify the root cause. Add a regression test, fix without altering unrelated features, run the full checks, and document any required environment or SQL changes. No live database changes, secrets changes, or deployment without explicit authorization."

### Release check
"Review the intended Git diff, run lint/tests/build, inspect the Vercel Preview deployment, check environment variables without exposing their values, verify the production database target, then provide a checklist. Do not merge or deploy to production until I explicitly say to."

## 7. Current known gaps (do not hide from marketing)

1. Custom domain google.bringmybite.com is not yet attached to the Google Vercel project.
2. Durable database configuration for the Google site was not confirmed; Vercel did not show Supabase URL/key variables in the current listing.
3. Main-site CSV exports are not full accounting exports; the current export function outputs subscription rows only and does not include instant-order rows even where the button says "Download Ledger CSV".
4. No built-in Excel/XLSX import workflow was found in either repository.
5. No complete live customer journey was run during this read-only review. Mark a feature "tested" only after the actual production test succeeds.
