import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function writeIfChanged(path, source) { fs.writeFileSync(path, source); console.log(`updated ${path}`); }
function replaceOnce(path, from, to) {
  let source = read(path);
  if (!source.includes(from)) return false;
  writeIfChanged(path, source.replace(from, to));
  return true;
}

// Banner pricing enforcement. Build must remain idempotent because Vercel may
// run prebuild more than once and the source may already contain the fix.
replaceOnce('src/components/customer/RegistrationModal.tsx',
`  const multiplier = duration === '1 Month' ? 1 : duration === '3 Months' ? 3 : 6;\n  const discountFactor = duration === '3 Months' ? 0.95 : duration === '6 Months' ? 0.90 : 1.0;\n  const calculatedTotal = Math.round(baseMonthlyPrice * multiplier * discountFactor);`,
`  const calculatedTotal = baseMonthlyPrice;`);
replaceOnce('src/components/customer/InstantOrderModal.tsx',
`  const totalAmount = unitPrice * quantity;`,
`  const totalAmount = unitPrice;`);
replaceOnce('src/components/customer/RenewalModal.tsx',
`  const multiplier = duration === '1 Month' ? 1 : duration === '3 Months' ? 3 : 6;\n  const discountFactor = duration === '3 Months' ? 0.95 : duration === '6 Months' ? 0.90 : 1.0;\n  const totalRenewalAmount = Math.round(basePrice * multiplier * discountFactor);`,
`  const totalRenewalAmount = basePrice;`);

// Order workflow bridge: central bmb_orders is the shared queue between Admin,
// Manager and Chef. These patches only connect existing UI operations to it.
let source = read('src/utils/orderStore.ts');
source = source.replace("  updatedAt: string;\n}", "  updatedAt: string;\n  assignedRole?: string;\n  assignedTo?: string;\n  preparationRequestedAt?: string;\n}");
source = source.replace("  if (patch.details !== undefined) out.details = patch.details;", "  if (patch.details !== undefined) out.details = patch.details;\n  if (patch.assignedRole !== undefined) out.assigned_role = patch.assignedRole;\n  if (patch.assignedTo !== undefined) out.assigned_to = patch.assignedTo;\n  if (patch.preparationRequestedAt !== undefined) out.preparation_requested_at = patch.preparationRequestedAt;");
source = source.replace("    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString()\n", "    updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString(),\n    assignedRole: row.assigned_role ?? row.assignedRole ?? '',\n    assignedTo: row.assigned_to ?? row.assignedTo ?? '',\n    preparationRequestedAt: row.preparation_requested_at ?? row.preparationRequestedAt ?? ''\n");
writeIfChanged('src/utils/orderStore.ts', source);

// Manager: connect its existing Order Routing tab to the central order queue.
source = read('src/components/panels/ManagerPanel.tsx');
if (!source.includes('orderRequests')) {
  source = source.replace("import React, { useState } from 'react';", "import React, { useEffect, useState } from 'react';\nimport { getStoredOrders, updateStoredOrder, StoredOrder } from '../../utils/orderStore';");
  source = source.replace("  const [pricingSuccess, setPricingSuccess] = useState(false);", "  const [pricingSuccess, setPricingSuccess] = useState(false);\n  const [orderRequests, setOrderRequests] = useState<StoredOrder[]>([]);\n  const [orderMessage, setOrderMessage] = useState('');");
  source = source.replace("  const handleSavePricing = async (e: React.FormEvent) => {", "  const loadOrderRequests = async () => setOrderRequests(await getStoredOrders());\n  useEffect(() => { void loadOrderRequests(); const onChange=()=>void loadOrderRequests(); window.addEventListener('bmb-order-request-change', onChange); window.addEventListener('storage', onChange); const t=window.setInterval(()=>void loadOrderRequests(),5000); return()=>{window.removeEventListener('bmb-order-request-change', onChange);window.removeEventListener('storage', onChange);window.clearInterval(t);}; }, []);\n  const routeOrder = async (order: StoredOrder, assignedRole: string) => { await updateStoredOrder(order.id, { assignedRole, assignedTo: assignedRole === 'chef' ? 'Chef Kitchen' : 'Dispatch' }); setOrderMessage(`${order.id} routed to ${assignedRole === 'chef' ? 'Chef Kitchen' : 'Dispatch'}.`); await loadOrderRequests(); setTimeout(()=>setOrderMessage(''),3000); };\n\n  const handleSavePricing = async (e: React.FormEvent) => {");
  const start = source.indexOf("        {/* ========================================================================= */}\n        {/* TAB 3: ORDER ROUTING & GATE DISPATCHES */}");
  const end = source.indexOf("        {/* ========================================================================= */}\n        {/* TAB 4: CHEF INDENT APPROVALS */}", start);
  if (start >= 0 && end > start) {
    const block = `        {/* ========================================================================= */}\n        {/* TAB 3: ORDER REQUESTS & ROUTING */}\n        {/* ========================================================================= */}\n        {activeTab === 'orders_dispatch' && (\n          <div className="space-y-6 animate-in fade-in duration-200">\n            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">\n              <div className="flex items-center justify-between pb-2 border-b border-gray-100">\n                <div><h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">Order Requests & Routing ({orderRequests.length})</h3><p className="text-xs text-gray-500 mt-1">Central order queue. Routing changes assignment only.</p></div>\n                <div className="flex items-center gap-2">{orderMessage && <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">✓ {orderMessage}</span>}<button onClick={() => void loadOrderRequests()} className="px-3 py-2 rounded-xl bg-[#124E33] text-white text-xs font-bold">Refresh</button></div>\n              </div>\n              <div className="space-y-3">\n                {orderRequests.length === 0 && <div className="p-8 text-center text-sm text-gray-500">No order requests available.</div>}\n                {orderRequests.map(order => (<div key={order.id} className="border border-gray-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><span className="font-mono font-black text-[#124E33]">{order.id}</span><span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 font-bold">{order.kind === 'instant' ? 'Instant Thali' : 'Subscription'}</span><span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-800 font-bold">{order.status}</span></div><div className="mt-1 text-sm font-bold">{order.customerName} • {order.planOrMeal}</div><div className="text-xs text-gray-500">₹{order.amount.toLocaleString()} • {order.phone} • Assigned: {order.assignedRole || 'Unassigned'}</div></div><div className="flex gap-2"><button onClick={() => void routeOrder(order,'chef')} className="px-3 py-2 rounded-xl bg-[#C88A24] text-black text-xs font-black">Route to Chef</button><button onClick={() => void routeOrder(order,'dispatch')} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-black">Route to Dispatch</button></div></div>))}\n              </div>\n            </div>\n          </div>\n        )}\n\n`;
    source = source.slice(0, start) + block + source.slice(end);
  }
  writeIfChanged('src/components/panels/ManagerPanel.tsx', source);
}

// Chef: add a dedicated preparation queue. Admin's existing Start Preparing
// action changes status to Preparing, which is the hand-off signal.
source = read('src/components/panels/ChefPanel.tsx');
if (!source.includes('preparationOrders')) {
  source = source.replace("import React, { useState } from 'react';", "import React, { useEffect, useState } from 'react';\nimport { getStoredOrders, updateStoredOrder, StoredOrder } from '../../utils/orderStore';");
  source = source.replace("  const [activeSubPanel, setActiveSubPanel] = useState<'cooking_alerts' | 'ingredient_indent'>('cooking_alerts');", "  const [activeSubPanel, setActiveSubPanel] = useState<'cooking_alerts' | 'ingredient_indent' | 'order_preparation'>('order_preparation');\n  const [preparationOrders, setPreparationOrders] = useState<StoredOrder[]>([]);\n  const [preparationMessage, setPreparationMessage] = useState('');");
  source = source.replace("  const [indentSuccessMsg, setIndentSuccessMsg] = useState('');", "  const [indentSuccessMsg, setIndentSuccessMsg] = useState('');\n  const loadPreparationOrders = async () => { const rows = await getStoredOrders(); setPreparationOrders(rows.filter(o => o.status === 'Preparing' && (!o.assignedRole || o.assignedRole === 'chef'))); };\n  useEffect(() => { void loadPreparationOrders(); const onChange=()=>void loadPreparationOrders(); window.addEventListener('bmb-order-request-change', onChange); window.addEventListener('storage', onChange); const t=window.setInterval(()=>void loadPreparationOrders(),5000); return()=>{window.removeEventListener('bmb-order-request-change', onChange);window.removeEventListener('storage', onChange);window.clearInterval(t);}; }, []);");
  const button = "            <button onClick={() => setActiveSubPanel('order_preparation')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeSubPanel === 'order_preparation' ? 'bg-[#C88A24] text-black shadow-xs' : 'text-emerald-200 hover:text-white'}`}><Flame className=\"w-4 h-4\" /><span>Order Preparation ({preparationOrders.length})</span></button>\n\n";
  source = source.replace("            <button\n              onClick={() => setActiveSubPanel('ingredient_indent')}", button + "            <button\n              onClick={() => setActiveSubPanel('ingredient_indent')");
  const marker = "        {/* ========================================================================= */}\n        {/* SUB-PANEL 1: COOKING ALERTS";
  const pos = source.indexOf(marker);
  if (pos >= 0) {
    const panel = `        {/* ORDER PREPARATION REQUESTS */}\n        {activeSubPanel === 'order_preparation' && (<div className="space-y-4 animate-in fade-in duration-200"><div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs"><div className="flex items-center justify-between pb-3 border-b border-gray-100"><div><h3 className="font-bold text-base text-gray-900">Order Preparation Requests ({preparationOrders.length})</h3><p className="text-xs text-gray-500 mt-1">Admin-approved orders marked for preparation appear here.</p></div><button onClick={() => void loadPreparationOrders()} className="px-3 py-2 rounded-xl bg-[#124E33] text-white text-xs font-bold">Refresh</button></div>{preparationMessage && <div className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded">✓ {preparationMessage}</div>}<div className="mt-4 space-y-3">{preparationOrders.length === 0 && <div className="p-8 text-center text-sm text-gray-500">No preparation requests waiting.</div>}{preparationOrders.map(order => (<div key={order.id} className="border border-amber-200 bg-amber-50/40 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"><div><div className="font-mono font-black text-[#124E33]">{order.id}</div><div className="font-bold text-gray-900 mt-1">{order.customerName} • {order.planOrMeal}</div><div className="text-xs text-gray-500">{order.phone} • ₹{order.amount.toLocaleString()} • {order.details || 'No special instructions'}</div></div><button onClick={async () => { await updateStoredOrder(order.id,{assignedRole:'chef',assignedTo:'Chef Kitchen'}); setPreparationMessage(`${order.id} assigned to Chef Kitchen.`); await loadPreparationOrders(); setTimeout(()=>setPreparationMessage(''),3000); }} className="px-4 py-2 rounded-xl bg-[#C88A24] text-black text-xs font-black">Start Preparation</button></div>))}</div></div></div>)}\n\n`;
    source = source.slice(0, pos) + panel + source.slice(pos);
  }
  writeIfChanged('src/components/panels/ChefPanel.tsx', source);
}

// Admin: when its existing Start Preparing action fires, persist the Chef hand-off.
replaceOnce('src/components/panels/AdminPanel.tsx',
"await updateStoredOrder(order.id, { status: next, paymentStatus });",
"await updateStoredOrder(order.id, { status: next, paymentStatus, ...(next === 'Preparing' ? { preparationRequestedAt: new Date().toISOString(), assignedRole: 'chef', assignedTo: 'Chef Kitchen' } : {}) });");

console.log('Order routing + Chef preparation bridge and Banner pricing enforcement applied.');
