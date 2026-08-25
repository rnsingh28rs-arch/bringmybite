export function normalizeIndianPhone(value: string): string {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.slice(-10);
}

export function whatsappLink(phone: string, message: string): string {
  const tenDigit = normalizeIndianPhone(phone);
  return `https://wa.me/91${tenDigit}?text=${encodeURIComponent(message)}`;
}
