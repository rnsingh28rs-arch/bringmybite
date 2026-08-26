import { isSupabaseConfigured, supabaseSelect, supabaseInsert, supabasePatch, supabaseRpc } from '../cms/supabaseRest';

export type StoredOrderKind = 'instant' | 'subscription';
export type StoredOrderStatus = 'Pending Verification' | 'Confirmed' | 'Preparing' | 'Dispatched' | 'Delivered' | 'Cancelled' | 'Rejected';

export interface StoredOrder {
  id: string;
  kind: StoredOrderKind;
  customerName: string;
  phone: string;
  whatsapp?: string;
  planOrMeal: string;
  amount: number;
  utrNumber: string;
  paymentSlip?: string;
  paymentStatus: 'Pending Verification' | 'Verified' | 'Rejected' | 'Failed';
  status: StoredOrderStatus;
  details?: string;
  createdAt: string;
  updatedAt: string;
}

const KEY = 'bmb_order_requests_v1';

function readLocal(): StoredOrder[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function writeLocal(rows: StoredOrder[]) { localStorage.setItem(KEY, JSON.stringify(rows)); window.dispatchEvent(new Event('bmb-order-request-change')); }

export async function addStoredOrder(order: StoredOrder): Promise<StoredOrder> {
  if (isSupabaseConfigured) {
    await supabaseInsert('bmb_orders', toDb(order) as any);
    const next = [order, ...readLocal().filter(x => x.id !== order.id)];
    writeLocal(next);
    return order;
  }
  const next = [order, ...readLocal().filter(x => x.id !== order.id)];
  writeLocal(next);
  return order;
}

export async function getStoredOrders(): Promise<StoredOrder[]> {
  if (isSupabaseConfigured) {
    const rows = await supabaseSelect<any>('bmb_orders', 'select=*&order=created_at.desc');
    return rows.map(normalizeRow);
  }
  return readLocal();
}

export async function updateStoredOrder(id: string, patch: Partial<StoredOrder>): Promise<void> {
  if (isSupabaseConfigured) {
    await supabasePatch('bmb_orders', `id=eq.${encodeURIComponent(id)}`, toDbPatch(patch) as any);
  }
  const rows = readLocal().map(o => o.id === id ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o);
  writeLocal(rows);
}

function toDb(order: StoredOrder) {
  return { id: order.id, kind: order.kind, customer_name: order.customerName, phone: order.phone, whatsapp: order.whatsapp || '', plan_or_meal: order.planOrMeal, amount: order.amount, utr_number: order.utrNumber, payment_slip: order.paymentSlip || null, payment_status: order.paymentStatus, status: order.status, details: order.details || '', created_at: order.createdAt, updated_at: order.updatedAt };
}
function toDbPatch(patch: Partial<StoredOrder>) {
  const out: Record<string, unknown> = {};
  if (patch.paymentStatus !== undefined) out.payment_status = patch.paymentStatus;
  if (patch.status !== undefined) out.status = patch.status;
  if (patch.details !== undefined) out.details = patch.details;
  if (patch.paymentSlip !== undefined) out.payment_slip = patch.paymentSlip;
  out.updated_at = new Date().toISOString();
  return out;
}
function normalizeRow(row: any): StoredOrder {
  return {
    id: row.id,
    kind: row.kind,
    customerName: row.customer_name ?? row.customerName ?? '',
    phone: row.phone ?? '',
    whatsapp: row.whatsapp ?? '',
    planOrMeal: row.plan_or_meal ?? row.planOrMeal ?? '',
    amount: Number(row.amount ?? 0),
    utrNumber: row.utr_number ?? row.utrNumber ?? '',
    paymentSlip: row.payment_slip ?? row.paymentSlip,
    paymentStatus: row.payment_status ?? row.paymentStatus ?? 'Pending Verification',
    status: row.status ?? 'Pending Verification',
    details: row.details ?? '',
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString()
  };
}

const TRACKING_KEY = 'bmb_last_order_tracking_v1';
export function saveLastOrderTracking(order: Pick<StoredOrder, 'id' | 'phone'>) {
  localStorage.setItem(TRACKING_KEY, JSON.stringify({ id: order.id, phone: order.phone }));
  window.dispatchEvent(new Event('bmb-order-tracking-change'));
}
export function getLastOrderTracking(): { id: string; phone: string } | null {
  try { return JSON.parse(localStorage.getItem(TRACKING_KEY) || 'null'); } catch { return null; }
}
export async function getPublicOrderStatus(id: string, phone: string): Promise<Pick<StoredOrder, 'id' | 'paymentStatus' | 'status' | 'updatedAt' | 'details'> | null> {
  if (!isSupabaseConfigured) {
    const local = readLocal().find(o => o.id === id && normalizePhone(o.phone) === normalizePhone(phone));
    return local ? { id: local.id, paymentStatus: local.paymentStatus, status: local.status, updatedAt: local.updatedAt, details: local.details } : null;
  }
  try {
    const rows = await supabaseRpc<any>('bmb_get_order_status', { p_order_id: id, p_phone: phone });
    const row = rows[0];
    if (!row) return null;
    return { id: row.id, paymentStatus: row.payment_status, status: row.status, updatedAt: row.updated_at, details: row.details || '' };
  } catch { return null; }
}
function normalizePhone(value: string) { return String(value || '').replace(/\D/g, '').slice(-10); }
