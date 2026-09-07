const STATUS_COPY = Object.freeze({
  'Pending Verification': 'PENDING VERIFICATION',
  Approved: 'APPROVED',
  Preparing: 'PREPARING',
  Dispatched: 'DISPATCHED',
  Delivered: 'DELIVERED',
  Declined: 'DECLINED',
});

export function buildOrderStatusMessage(order, status, declineReason = '') {
  const label = STATUS_COPY[status] || String(status).toUpperCase();
  const type = order.kind === 'instant' ? 'instant thali order' : 'subscription payment';
  const amount = Number(order.amount || 0).toLocaleString('en-IN');
  const lines = [
    `Namaste ${order.customerName || 'Customer'}! 🙏`,
    '',
    `Your ${type} ${order.id} status is ${label}.`,
    `Amount: ₹${amount}`,
  ];

  if (status === 'Approved') {
    lines.push(`Your payment has been VERIFIED.\nUTR: ${order.utrNumber || '—'}`);
  }
  if (status === 'Preparing') lines.push('Our kitchen team has started preparing your order. 👨‍🍳');
  if (status === 'Dispatched') lines.push('Your order has been dispatched and is on the way. 🚚');
  if (status === 'Delivered') {
    lines.push(
      'Your order has been delivered successfully. ✅',
      '',
      '⭐ RATE YOUR ORDER',
      'Please reply with a rating from 1 to 5 stars (⭐1 to ⭐5).',
      'Then write your review in the same WhatsApp reply.',
      'Example: Rating: ⭐⭐⭐⭐⭐ | Review: Food was excellent. Thank you!'
    );
  }
  if (status === 'Declined') {
    const savedReason = String(order.details || '').match(/Decline reason:\s*(.+?)(?:\n|$)/i)?.[1]?.trim();
    lines.push('', `Reason for decline: ${declineReason || savedReason || 'The order could not be approved after verification.'}`);
  }

  lines.push('', 'Bring My Bite | Shree Foods', 'WhatsApp/Help: +91 9315075165');
  return lines.join('\n');
}
