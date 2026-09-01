export function adjustStock(currentStock, delta) {
  const current = Number(currentStock);
  const change = Number(delta);
  return Math.max(0, (Number.isFinite(current) ? current : 0) + (Number.isFinite(change) ? change : 0));
}

export function stockStatus(stock, minThreshold) {
  const quantity = Math.max(0, Number(stock) || 0);
  const threshold = Math.max(0, Number(minThreshold) || 0);
  if (quantity <= 0) return 'Critical';
  if (quantity <= threshold) return 'Low Stock';
  return 'In Stock';
}
