import React, { useEffect, useMemo, useState } from 'react';
import { BellRing, CheckCircle2, Clock3, CookingPot, Truck, XCircle, X } from 'lucide-react';
import { getLastOrderTracking, getPublicOrderStatus } from '../../utils/orderStore';

function deliveryMinutes(details = ''): number {
  const text = details.toLowerCase();
  if (text.includes('galgotia')) return 45;
  if (text.includes('noida') && !text.includes('greater noida')) return 45;
  if (text.includes('greater noida') || /knowledge\s*park|alpha|beta|gamma/.test(text)) return 30;
  return 45;
}
function statusCopy(status: string, details: string) {
  const minutes = deliveryMinutes(details);
  if (status === 'Approved') return { title: 'Payment Verified & Order Approved', text: `Your payment has been verified. Your food will be delivered in about ${minutes} minutes.`, icon: <CheckCircle2 className="w-6 h-6" />, tone: 'green' };
  if (status === 'Preparing') return { title: 'Order Approved — Being Prepared', text: `Your meal is being prepared. Expected delivery is about ${minutes} minutes.`, icon: <CookingPot className="w-6 h-6" />, tone: 'amber' };
  if (status === 'Dispatched') return { title: 'Order Dispatched', text: 'Your food is on the way. Please be ready at your selected delivery point.', icon: <Truck className="w-6 h-6" />, tone: 'blue' };
  if (status === 'Delivered') return { title: 'Order Delivered', text: 'Your order has been marked delivered. Enjoy your meal! 🙏', icon: <CheckCircle2 className="w-6 h-6" />, tone: 'green' };
  if (status === 'Declined') return { title: 'Order / Payment Declined', text: 'Your request was not approved. Please contact Bring My Bite on WhatsApp for help.', icon: <XCircle className="w-6 h-6" />, tone: 'red' };
  return { title: 'Payment Submitted — Under Verification', text: 'Your order is submitted. We are checking the UTR and payment screenshot before approval.', icon: <Clock3 className="w-6 h-6" />, tone: 'amber' };
}
export const OrderStatusNotifier: React.FC = () => {
  const [tracking, setTracking] = useState(getLastOrderTracking());
  const [status, setStatus] = useState<any>(null);
  const [visible, setVisible] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  useEffect(() => { const sync = () => { setTracking(getLastOrderTracking()); setVisible(true); }; window.addEventListener('bmb-order-tracking-change', sync); return () => window.removeEventListener('bmb-order-tracking-change', sync); }, []);
  useEffect(() => {
    if (!tracking) return;
    let active = true;
    const load = async () => { const next = await getPublicOrderStatus(tracking.id, tracking.phone); if (!active || !next) return; setStatus((prev: any) => { if (prev && prev.status !== next.status) setVisible(true); return next; }); setLastUpdated(next.updatedAt || ''); };
    void load(); const timer = window.setInterval(() => void load(), 8000); return () => { active = false; window.clearInterval(timer); };
  }, [tracking]);
  const copy = useMemo(() => statusCopy(status?.status || 'Pending Verification', status?.details || ''), [status]);
  if (!tracking || !status || !visible) return null;
  const tone = copy.tone === 'green' ? 'border-emerald-300 bg-emerald-50 text-emerald-950' : copy.tone === 'red' ? 'border-rose-300 bg-rose-50 text-rose-950' : copy.tone === 'blue' ? 'border-blue-300 bg-blue-50 text-blue-950' : 'border-amber-300 bg-amber-50 text-amber-950';
  return <div className="sticky top-0 z-[35] px-3 pt-3 pointer-events-none"><div className={`max-w-5xl mx-auto pointer-events-auto rounded-2xl border-2 shadow-lg p-4 ${tone}`}><div className="flex items-start gap-3"><div className="shrink-0 mt-0.5">{copy.icon}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm sm:text-base">{copy.title}</strong><span className="text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full bg-white/70">{status.status}</span></div><p className="text-xs sm:text-sm mt-1">{copy.text}</p><p className="text-[10px] mt-2 opacity-70">Order: {tracking.id}{lastUpdated ? ` • Updated ${new Date(lastUpdated).toLocaleTimeString()}` : ''}</p></div><button onClick={() => setVisible(false)} className="shrink-0 p-1 rounded-lg hover:bg-black/10" aria-label="Dismiss notification"><X className="w-4 h-4" /></button></div></div></div>;
};
