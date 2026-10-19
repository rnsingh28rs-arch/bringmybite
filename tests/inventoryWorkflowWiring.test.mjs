import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('manager stock panel routes open purchases through the approved receipt tab', () => {
  const manager = read('src/components/panels/ManagerStockPanel.tsx');
  assert.match(manager, /InventoryPaymentApprovalPanel mode="manager"/);
  assert.match(manager, /disabled=\{ordered>0(?:\|\|Boolean\(movementBusy\[i\.id\]\))?\}/);
  assert.match(manager, /Use Purchase &amp; Receipts|Use Purchase & Receipts/);
});

test('purchase submission, payment approval, rejection and stock receipt use atomic RPCs', () => {
  const panel = read('src/components/panels/InventoryPaymentApprovalPanel.tsx');
  const operations = read('src/utils/inventoryOperations.ts');
  assert.match(panel, /bmb_submit_inventory_purchase_request/);
  assert.match(panel, /bmb_approve_inventory_purchase_payment/);
  assert.match(panel, /bmb_reject_inventory_purchase_payment/);
  assert.match(panel, /recordApprovedInventoryPurchaseWithGrn/);
  assert.match(operations, /bmb_receive_inventory_purchase/);
  assert.match(read('src/components/panels/ReceiptPreview.tsx'), /Admin payment approval is required before receiving stock/);
  assert.match(read('supabase/migrations/20261019140000_idempotent_inventory_movements.sql'), /v_total_received>v_indent.quantity_needed/);
});

test('staff routes require Supabase authentication and refresh expiring sessions', () => {
  const app = read('src/App.tsx');
  const login = read('src/components/panels/SimpleStaffLogin.tsx');
  const rest = read('src/cms/supabaseRest.ts');
  assert.match(app, /SimpleStaffLogin role=\{role\}/);
  assert.match(login, /refresh_token/);
  assert.match(login, /grant_type=refresh_token/);
  assert.match(rest, /session\.expires_at/);
});

test('security migration blocks anonymous inventory access and direct stock edits', () => {
  const migration = read('supabase/migrations/20261015050000_secure_inventory_and_staff_access.sql');
  assert.match(migration, /DROP POLICY IF EXISTS bmb_public_full_access ON public\.bmb_inventory/);
  assert.match(migration, /bmb_guard_inventory_stock_updates/);
  assert.match(migration, /bmb_guard_chef_indent_updates/);
  assert.match(migration, /bmb_is_inventory_finance_staff/);
});
