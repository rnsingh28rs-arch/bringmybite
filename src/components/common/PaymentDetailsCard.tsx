import React, { useState } from 'react';
import { getQrCodeUrl } from '../../data/paymentConfig';
import { useCms } from '../../cms/CmsContext';
import {
  QrCode,
  Copy,
  Check,
  Building2,
  User,
  CreditCard,
  FileCheck,
  ShieldCheck,
  ExternalLink,
  Ban,
  Smartphone
} from 'lucide-react';

interface PaymentDetailsCardProps {
  amount?: number;
  orderReference?: string;
  className?: string;
  compact?: boolean;
}

export const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  amount,
  orderReference = 'BMB Order',
  className = '',
  compact = false
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { payment } = useCms();

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const qrCodeUrl = payment.qrUrl || (amount
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${payment.upiId}&pn=${encodeURIComponent(payment.accountHolder)}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderReference)}`)}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${payment.upiId}&pn=${encodeURIComponent(payment.accountHolder)}&cu=INR`)}`);

  return (
    <div className={`bg-white rounded-2xl border-2 border-[#C88A24] overflow-hidden shadow-md ${className}`}>
      
      {/* Header Banner */}
      <div className="bg-[#0C3822] text-white p-3.5 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#C88A24] text-black flex items-center justify-center font-extrabold text-sm shadow-xs">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#F2C94C] font-serif-title uppercase tracking-wide">
              Official {payment.bankName} & UPI Payment Details
            </h4>
            <p className="text-[11px] text-emerald-200">
              Direct Bank Settlement • 100% Safe & Instant Confirmation
            </p>
          </div>
        </div>

        {amount && (
          <div className="text-right">
            <span className="text-[10px] text-emerald-300 block uppercase font-bold">Payable Amount</span>
            <span className="text-base sm:text-lg font-black text-[#F2C94C]">₹{amount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* No COD Strict Notice */}
      <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center gap-2 text-amber-900 text-xs font-semibold">
        <Ban className="w-4 h-4 text-rose-600 shrink-0" />
        <span>
          <strong>Prepaid Policy Notice:</strong> All meal deliveries are strictly prepaid via UPI, QR, or Net Banking. <span className="text-rose-700 font-bold">No Cash on Delivery (COD)</span> is available.
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Main Grid: QR Code Left + UPI & Bank Info Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Left Column: QR Code Visual */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E1D5] text-center space-y-2">
            <div className="bg-white p-2.5 rounded-xl border border-gray-300 shadow-xs relative group">
              <img
                src={qrCodeUrl}
                alt="Axis Bank UPI QR Code"
                className="w-36 h-36 sm:w-44 sm:h-44 object-contain rounded-md"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none">
                <span className="bg-black text-white text-[10px] px-2 py-1 rounded-full font-bold">Scan to Pay</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] font-extrabold text-gray-900 block font-mono">
                {payment.upiId}
              </span>
              <span className="text-[10px] text-gray-500 block">
                Scan with Google Pay, PhonePe, Paytm, BHIM, or Axis Mobile
              </span>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(payment.upiId, 'upiId')}
              className="px-3 py-1.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer w-full justify-center"
            >
              {copiedField === 'upiId' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#F2C94C]" />
                  <span>UPI ID Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy UPI ID ({payment.upiId})</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Bank Details Table */}
          <div className="md:col-span-7 space-y-2.5">
            
            <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8E1D5] space-y-2 text-xs">
              
              {/* Bank Name */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#124E33]" />
                  Bank Name:
                </span>
                <span className="font-extrabold text-gray-900">{payment.bankName}</span>
              </div>

              {/* Account Holder */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#124E33]" />
                  Primary Account Holder:
                </span>
                <span className="font-bold text-gray-900">{payment.accountHolder}</span>
              </div>

              {/* Account Number */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#124E33]" />
                  Account Number:
                </span>
                <div className="flex items-center gap-1.5">
                  <code className="font-mono font-extrabold text-xs sm:text-sm text-[#0C3822] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {payment.accountNumber}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(payment.accountNumber, 'accNo')}
                    className="p-1 text-gray-500 hover:text-black rounded hover:bg-gray-200 transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedField === 'accNo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* IFSC Code */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#124E33]" />
                  IFSC Code:
                </span>
                <div className="flex items-center gap-1.5">
                  <code className="font-mono font-extrabold text-xs text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {payment.ifscCode}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(payment.ifscCode, 'ifsc')}
                    className="p-1 text-gray-500 hover:text-black rounded hover:bg-gray-200 transition-colors"
                    title="Copy IFSC"
                  >
                    {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Authorized Signatories */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#124E33]" />
                  Authorized Signatory:
                </span>
                <span className="font-semibold text-gray-800">{payment.authorizedSignatory}</span>
              </div>

              {/* Account Type */}
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-gray-500">Account Type:</span>
                <span className="font-semibold text-gray-800 text-[11px] bg-white px-2 py-0.5 rounded border border-gray-200">
                  {payment.accountType}
                </span>
              </div>

            </div>

            {/* Quick Copy All Details Button */}
            <button
              type="button"
              onClick={() => {
                const fullText = `Bank: ${payment.bankName}\nA/C Name: ${payment.accountHolder}\nA/C Number: ${payment.accountNumber}\nIFSC: ${payment.ifscCode}\nSignatory: ${payment.authorizedSignatory}\nType: ${payment.accountType}\nUPI ID: ${payment.upiId}`;
                copyToClipboard(fullText, 'allBank');
              }}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0C3822] text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
            >
              {copiedField === 'allBank' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>All Bank Details Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#124E33]" />
                  <span>Copy Complete Bank Details (for NetBanking/NEFT)</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
