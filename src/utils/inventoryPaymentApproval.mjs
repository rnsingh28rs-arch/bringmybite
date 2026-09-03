export function calculateLineTotal(quantity, purchasePrice) {
  const qty = Number(quantity);
  const price = Number(purchasePrice);
  if (!Number.isFinite(qty) || qty <= 0) throw new Error('Quantity must be greater than zero.');
  if (!Number.isFinite(price) || price <= 0) throw new Error('Purchase price must be greater than zero.');
  return Number((qty * price).toFixed(2));
}

export function buildPaymentRequest(indents) {
  if (!Array.isArray(indents) || indents.length === 0) throw new Error('At least one approved indent is required.');
  const lines = indents.map(indent => ({
    indentId: indent.id,
    itemName: String(indent.itemName || '').trim(),
    quantity: Number(indent.quantityNeeded),
    unit: indent.unit || 'kg',
    purchasePrice: Number(indent.purchasePrice),
    lineTotal: calculateLineTotal(indent.quantityNeeded, indent.purchasePrice),
  }));
  if (lines.some(line => !line.itemName)) throw new Error('Every purchase line must have an item name.');
  return {
    lines,
    totalAmount: Number(lines.reduce((sum, line) => sum + line.lineTotal, 0).toFixed(2)),
  };
}

export function paymentStatusLabel(indent) {
  if (indent.paymentStatus === 'Pending Admin Approval') return 'Waiting for Admin Payment Approval';
  if (indent.paymentStatus === 'Approved') return 'Payment Approved';
  if (indent.paymentStatus === 'Rejected') return 'Payment Rejected';
  return 'Waiting for Manager Purchase Price';
}
