export interface BankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  authorizedSignatory: string;
  upiId: string;
  phone: string;
}

export const OFFICIAL_BANK_DETAILS: BankDetails = {
  // Public/client-side fallback is intentionally blank. Live payment details
  // must come from the configured Supabase payment settings, not hardcoded code.
  bankName: '',
  accountHolder: '',
  accountNumber: '',
  ifscCode: '',
  accountType: '',
  authorizedSignatory: '',
  upiId: '',
  phone: ''
};

export const getUpiPaymentUrl = (amount: number, note: string = 'Bring My Bite Order', payment: Partial<BankDetails> = OFFICIAL_BANK_DETAILS) => {
  const payee = encodeURIComponent(String(payment.accountHolder || '').trim());
  const upi = String(payment.upiId || '').trim();
  if (!upi) return '';
  const encodedNote = encodeURIComponent(note);
  return `upi://pay?pa=${encodeURIComponent(upi)}&pn=${payee}&am=${amount}&cu=INR&tn=${encodedNote}`;
};

export const getQrCodeUrl = (amount: number, note: string = 'Bring My Bite Order', payment: Partial<BankDetails> = OFFICIAL_BANK_DETAILS) => {
  const upiUrl = getUpiPaymentUrl(amount, note, payment);
  return upiUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}` : '';
};
