const normalizePhone = value => String(value || '').replace(/\D/g, '').slice(-10);

export function getCustomerSubscription(subscriptions, customerPhone = '') {
  const phone = normalizePhone(customerPhone);
  if (!phone) return null;
  return (subscriptions || []).find(s => normalizePhone(s.mobileNumber || s.phone) === phone) || null;
}

export function canCustomerSeeStaffPortals(role = 'customer') {
  return role !== 'customer';
}

export function customerPriceLabel(value) {
  const amount = Number(value || 0);
  return amount > 0 ? `₹${amount}` : 'Price unavailable';
}
