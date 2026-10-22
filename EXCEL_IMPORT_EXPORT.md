# Excel / CSV Quick Guide — BringMyBite

Last checked: 22 October 2026.

## What works right now

### Main website
The main website contains CSV export buttons in the Admin panel:
- Admin → Sales & Financials → Download Ledger CSV
- Admin → Customer Accounts → Export Customer Database CSV

Both buttons use the same export function in src/components/panels/AdminPanel.tsx. The file is named BringMyBite_Subscriptions_YYYY-MM-DD.csv and contains these fields:

    ID, Customer Name, Mobile, Category, Package, Amount Paid, Route Code, Status

**Important:** Despite the "Download Ledger CSV" label, the current function exports subscription records only. It does not include instant-order rows. Do not use this as a complete accounting ledger.

### Google website
No one-click Excel/XLSX import was found in the reviewed repository. Do not promise this feature to marketing or customers until it is implemented and tested.

## Open the CSV in Excel
1. Open the authorized admin page.
2. Click the relevant CSV export button and save the downloaded file in an access-controlled folder.
3. Open Excel → Data → From Text/CSV if double-clicking does not split columns correctly.
4. Select UTF-8 encoding and comma delimiter if Excel asks.
5. Save a working copy as .xlsx for spreadsheet analysis. Keep the original export unchanged as the source copy.
6. Customer names, mobile numbers, route codes, payment details and addresses are sensitive; share only with authorized people.

## Importing an Excel sheet into the live website
A one-click XLSX import is **not currently available** in the reviewed code. Do not upload an arbitrary spreadsheet directly to the production Supabase tables. The exact destination and column mapping must be decided first.

Safe preparation:
1. Make a backup/export of the intended destination data.
2. In Excel, remove merged cells, formulas, duplicate rows and blank records. Keep a single header row.
3. Preserve phone numbers as text (not numbers) so leading zeros or country codes are not lost.
4. Save a copy as CSV UTF-8.
5. Confirm the destination table and exact mapping for every column.
6. Use a purpose-built, authenticated importer that previews rows, validates data, detects duplicates, reports rejected rows and supports rollback. Test on staging or a non-production copy first.
7. Only run against production after a verified backup and a small approved test batch. Verify imported rows inside the admin UI and database.

## Do not do these things
- Do not import into bring-my-bite-v2 just because it has "v2" in the name.
- Do not run SQL scripts that drop/recreate production tables.
- Do not put a Supabase service-role key in a browser or a VITE_/NEXT_PUBLIC_ variable.
- Do not share the CSV in public GitHub, public links or marketing group chats.
- Do not claim an Excel import is implemented when only CSV export exists.

## Copy/paste request to build the importer later
"Please add a secure admin-only CSV/XLSX import for the selected data type. First inspect the live schema, types, RLS and existing admin flow; do not guess the destination table. Include a downloadable template, column mapping, preview, validation, duplicate detection, row-by-row errors, safe transaction/rollback, audit logging and tests. Do not expose privileged keys to the browser. Keep the existing export intact. Run tests and build, then give me exact results. Do not deploy to production until I authorize it."
