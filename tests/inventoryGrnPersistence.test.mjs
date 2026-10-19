import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = relativePath => fs.readFileSync(new URL('../' + relativePath, import.meta.url), 'utf8');
const migration = fs.readFileSync(new URL('../supabase/migrations/20261019150000_persist_inventory_grn_receipts.sql', import.meta.url), 'utf8');
const preview = fs.readFileSync(new URL('../src/components/panels/ReceiptPreview.tsx', import.meta.url), 'utf8');
const manager = fs.readFileSync(new URL('../src/components/panels/ManagerStockPanel.tsx', import.meta.url), 'utf8');

test('GRN metadata is persisted in a staff-protected receipt table', () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS public\.bmb_inventory_receipts/);
  assert.match(migration, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /bmb_inventory_receipts_staff_read/);
  assert.match(migration, /REVOKE ALL ON TABLE public\.bmb_inventory_receipts FROM PUBLIC, anon, authenticated/);
});

test('stock receipt and GRN metadata are handled in the same database transaction', () => {
  assert.match(migration, /bmb_receive_inventory_purchase_idempotent/);
  assert.match(migration, /INSERT INTO public\.bmb_inventory_receipts/);
  assert.match(migration, /Idempotency key was already used for a different GRN receipt/);
  assert.match(migration, /A receipt idempotency key and GRN number are required/);
});

test('receipt preview exposes an explicit record action rather than print-only behaviour', () => {
  assert.match(preview, /onRecordReceipt/);
  assert.match(preview, /Record Receipt & Save GRN/);
  assert.match(manager, /recordApprovedInventoryPurchaseWithGrn/);
});

test('staff inventory panels expose the central movement and GRN history', () => {
  const ledger = read('src/components/panels/InventoryLedgerPanel.tsx');
  const admin = read('src/components/panels/AdminPanel.tsx');
  const manager = read('src/components/panels/ManagerStockPanel.tsx');
  assert.match(ledger, /bmb_inventory_movements/);
  assert.match(ledger, /bmb_inventory_receipts/);
  assert.match(ledger, /quantity_delta/);
  assert.match(ledger, /balance_after/);
  assert.match(admin, /InventoryLedgerPanel/);
  assert.match(manager, /Ledger & GRNs/);
});
