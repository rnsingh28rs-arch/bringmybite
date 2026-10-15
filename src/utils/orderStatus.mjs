export function toUiOrderStatus(status) {
  if (status === 'Confirmed') return 'Approved';
  if (status === 'Rejected') return 'Declined';
  return status;
}

export function toDatabaseOrderStatus(status) {
  if (status === 'Approved') return 'Confirmed';
  if (status === 'Declined') return 'Rejected';
  return status;
}
