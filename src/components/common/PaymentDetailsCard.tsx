import React, { useState } from 'react';
import { getQrCodeUrl, getUpiPaymentUrl } from '../../data/paymentConfig';
import { useCms } from '../../cms/CmsContext';
import { Copy, Check, Building2, User, CreditCard, FileCheck, Ban, Smartphone, ExternalLink } from 'lucide-react';

interface PaymentDetailsCardProps {
  amount?: number;
  orderReference?: string;
  className?: string;
  compact?: boolean;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({ amount, orderReference = 'BMB Order', className = '' }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { payment } = useCms();

  const copyToClipboard = (text: string, fieldId: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    window.setTimeout(() => setCopiedField(null), 2000);
  };

  const payableAmount = Number(amount || 0);
  const upiUrl = payableAmount > 0
    ? getUpiPaymentUrl(payableAmount, orderReference)
    : getUpiPaymentUrl(0, orderReference);

  const googlePayUrl = upiUrl.replace(/^upi:\/\/pay\?/, 'gpay://upi/pay?');
  const phonePeUrl = upiUrl.replace(/^upi:\/\/pay\?/, 'phonepe://pay?');
  const paytmUrl = upiUrl.replace(/^upi:\/\/pay\?/, 'paytmmp://pay?');

  const openPaymentApp = (url: string) => {
    if (payableAmount <= 0) {
      alert('The payable amount is not configured yet. Please ask the administrator to configure the current price.');
      return;
    }
    window.location.href = url;
  };

  const qrCodeUrl = payableAmount > 0
    ? getQrCodeUrl(payableAmount, orderReference)
    : (payment.qrUrl || getQrCodeUrl(0, orderReference));

  return (
    <div className={`bg-white rounded-2xl border-2 border-[#C88A24] overflow-hidden shadow-md ${className}`}>
      <div className="bg-[#0C3822] text-white p-3.5 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#C88A24] text-black flex items-center justify-center font-extrabold text-sm shadow-xs"><CreditCard className="w-4 h-4" /></div>
          <div><h4 className="text-xs sm:text-sm font-bold text-[#F2C94C] uppercase tracking-wide">Official UPI Payment Details</h4><p className="text-[11px] text-emerald-200">Pay the exact amount shown below using your preferred UPI app.</p></div>
        </div>
        {amount !== undefined && <div className="text-right"><span className="text-[10px] text-emerald-300 block uppercase font-bold">Payable Amount</span><span className="text-base sm:text-lg font-black text-[#F2C94C]">₹{payableAmount.toLocaleString()}</span></div>}
      </div>
      <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center gap-2 text-amber-900 text-xs font-semibold"><Ban className="w-4 h-4 text-rose-600 shrink-0" /><span><strong>Prepaid:</strong> payment must match the payable amount before verification. <span className="text-rose-700 font-bold">No COD.</span></span></div>
      <div className="p-4 sm:p-5 space-y-4">
        {payableAmount > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#0C3822]"><Smartphone className="w-4 h-4" /> Pay directly from your UPI app</div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <button type="button" onClick={() => openPaymentApp(upiUrl)} className="px-3 py-2.5 rounded-xl bg-[#124E33] hover:bg-[#0A2A1B] text-white text-xs font-extrabold flex items-center justify-center gap-1.5">Choose UPI App <ExternalLink className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => openPaymentApp(googlePayUrl)} className="px-3 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-900 text-xs font-extrabold border border-gray-300 flex items-center justify-center gap-1.5">Google Pay</button>
              <button type="button" onClick={() => openPaymentApp(phonePeUrl)} className="px-3 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-900 text-xs font-extrabold border border-gray-300 flex items-center justify-center gap-1.5">PhonePe</button>
              <button type="button" onClick={() => openPaymentApp(paytmUrl)} className="px-3 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-900 text-xs font-extrabold border border-gray-300 flex items-center justify-center gap-1.5">Paytm</button>
            </div>
            <p className="text-[10px] text-emerald-900">Your phone will open the selected UPI app with <strong>₹{payableAmount.toLocaleString()}</strong> and <strong>{payment.upiId}</strong> already filled. If the app cannot open, use the QR or Copy UPI ID below.</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E1D5] text-center space-y-2">
            <div className="bg-white p-2.5 rounded-xl border border-gray-300 shadow-xs"><img src={qrCodeUrl} alt="UPI payment QR code" className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-md" /></div>
            <div className="space-y-0.5"><span className="text-[11px] font-extrabold text-gray-900 block font-mono">{payment.upiId}</span><span className="text-[10px] text-gray-500 block">Google Pay, PhonePe, Paytm, BHIM and other UPI apps</span></div>
            <button type="button" onClick={() => copyToClipboard(payment.upiId, 'upiId')} className="px-3 py-1.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs w-full justify-center">{copiedField === 'upiId' ? <><Check className="w-3.5 h-3.5 text-[#F2C94C]" /><span>UPI ID Copied</span></> : <><Copy className="w-3.5 h-3.5" /><span>Copy UPI ID</span></>}</button>
          </div>
          <div className="md:col-span-7 space-y-2.5">
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E1D5] space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-[#124E33]" />Bank Name:</span><span className="font-extrabold text-gray-900">{payment.bankName}</span></div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#124E33]" />Account Holder:</span><span className="font-bold text-gray-900">{payment.accountHolder}</span></div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-[#124E33]" />Account Number:</span><div className="flex items-center gap-1.5"><code className="font-mono font-extrabold text-xs sm:text-sm text-[#0C3822] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{payment.accountNumber}</code><button type="button" onClick={() => copyToClipboard(payment.accountNumber, 'accNo')} className="p-1 text-gray-500 hover:text-black rounded hover:bg-gray-200">{copiedField === 'accNo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}</button></div></div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5"><span className="text-gray-500 flex items-center gap-1.5"><FileCheck className="w-3.5 h-3.5 text-[#124E33]" />IFSC:</span><span className="font-mono font-extrabold text-xs text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{payment.ifscCode}</span></div>
              <div className="flex items-center justify-between pt-0.5"><span className="text-gray-500">Account Type:</span><span className="font-semibold text-gray-800 text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200">{payment.accountType}</span></div>
            </div>
            <button type="button" onClick={() => copyToClipboard(`Bank: ${payment.bankName}\nA/C Name: ${payment.accountHolder}\nA/C Number: ${payment.accountNumber}\nIFSC: ${payment.ifscCode}\nUPI ID: ${payment.upiId}`, 'allBank')} className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0C3822] text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 border border-emerald-200">{copiedField === 'allBank' ? <><Check className="w-3.5 h-3.5 text-emerald-600" /><span>Payment Details Copied</span></> : <><Copy className="w-3.5 h-3.5 text-[#124E33]" /><span>Copy Payment Details</span></>}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
