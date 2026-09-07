export const ORDER_LIFECYCLE = ['Pending Verification', 'Approved', 'Preparing', 'Dispatched', 'Delivered'];

const NEXT_STATUS = Object.freeze({
  'Pending Verification': 'Approved',
  Approved: 'Preparing',
  Preparing: 'Dispatched',
  Dispatched: 'Delivered',
});

export function getNextOrderStatus(status) {
  return NEXT_STATUS[status] || null;
}

export function getOrderActions(status, role) {
  if (role === 'admin' && status === 'Pending Verification') return ['Approved', 'Declined'];
  if (role === 'chef' && status === 'Approved') return ['Preparing'];
  if (role === 'chef' && status === 'Preparing') return ['Dispatched'];
  if (role === 'manager' && status === 'Dispatched') return ['Delivered'];
  return [];
}
