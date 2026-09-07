export function getNewOrders(previousIds, orders) {
  const known = previousIds instanceof Set ? previousIds : new Set(previousIds || []);
  return orders.filter((order) => order?.id && !known.has(order.id));
}

export function formatNewOrderAlert(order) {
  const customer = order?.customerName || 'Customer';
  const id = order?.id || '—';
  const amount = Number(order?.amount ?? order?.totalPrice ?? 0).toLocaleString('en-IN');
  return `NEW ORDER REQUEST — ${customer} — ${id} — ₹${amount}`;
}
