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
  bankName: 'Axis Bank',
  accountHolder: 'Quality Pan',
  accountNumber: '922020048876624',
  ifscCode: 'UTIB0000624',
  accountType: 'Proprietorship firm Current A/c',
  authorizedSignatory: 'Rahul Narendra Singh',
  upiId: '9004848984@axisbank',
  phone: '+91 9004848984'
};

export const getUpiPaymentUrl = (amount: number, note: string = 'Bring My Bite Order') => {
  const payee = encodeURIComponent(OFFICIAL_BANK_DETAILS.accountHolder);
  const upi = OFFICIAL_BANK_DETAILS.upiId;
  const encodedNote = encodeURIComponent(note);
  return `upi://pay?pa=${upi}&pn=${payee}&am=${amount}&cu=INR&tn=${encodedNote}`;
};

export const getQrCodeUrl = (amount: number, note: string = 'Bring My Bite Order') => {
  const upiUrl = getUpiPaymentUrl(amount, note);
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;
};
