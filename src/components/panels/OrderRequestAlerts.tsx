import React, { useEffect, useRef, useState } from 'react';
import { BellRing, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { getStoredOrders, StoredOrder, updateStoredOrder } from '../../utils/orderStore';
import { formatNewOrderAlert, getNewOrders } from '../../utils/orderAlerts.mjs';

const ALERT_POLL_MS = 3000;
const PENDING_STATUSES = new Set(['Pending Verification']);

export const OrderRequestAlerts: React.FC = () => {
  const knownIdsRef = useRef<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);
  const [pendingOrders, setPendingOrders] = useState<StoredOrder[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const enableAlerts = async () => {
    try {
      if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission();
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const context = audioContextRef.current || new AudioContextClass();
        audioContextRef.current = context;
        if (context.state === 'suspended') await context.resume();
      }
      setAlertsEnabled(true);
      void refresh(true);
    } catch { setAlertsEnabled(false); }
  };

  const playAlert = () => {
    try {
      const context = audioContextRef.current;
      if (!context || context.state !== 'running') return;
      const now = context.currentTime;
      [880, 1174, 1568].forEach((frequency, index) => {
        const oscillator = context.createOscillator(); const gain = context.createGain();
        oscillator.frequency.value = frequency; oscillator.type = 'sine';
        const start = now + index * 0.12;
        gain.gain.setValueAtTime(0.0001, start); gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
        oscillator.connect(gain); gain.connect(context.destination); oscillator.start(start); oscillator.stop(start + 0.2);
      });
    } catch { /* audio is optional */ }
  };

  const announce = (order: StoredOrder) => {
    playAlert();
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification('Bring My Bite — New Order Request', { body: `${order.customerName || 'Customer'} • ${order.id} • ₹${Number(order.amount || order.totalPrice || 0).toLocaleString('en-IN')}`, tag: `bmb-order-${order.id}` }); } catch { /* optional */ }
    }
    if (alertsEnabled && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(`New order request from ${order.customerName || 'customer'}. Order ${order.id}.`)); } catch { /* optional */ }
    }
  };

  const refresh = async (announcePending = false) => {
    const orders = await getStoredOrders();
    const pending = orders.filter(order => PENDING_STATUSES.has(order.status));
    setPendingOrders(pending);
    const newOrders = getNewOrders(knownIdsRef.current, pending);
    pending.forEach(order => knownIdsRef.current.add(order.id));
    if (announcePending) pending.forEach(announce);
    else newOrders.forEach(announce);
  };

  const handleStatus = async (order: StoredOrder, status: 'Approved' | 'Declined') => {
    setBusyId(order.id);
    try { await updateStoredOrder(order.id, { status, paymentStatus: status === 'Approved' ? 'Verified' : 'Rejected' }); await refresh(false); }
    finally { setBusyId(null); }
  };

  useEffect(() => {
    void refresh(false);
    const onChange = () => void refresh(false);
    const onFocus = () => void refresh(false);
    window.addEventListener('bmb-order-request-change', onChange);
    window.addEventListener('storage', onChange);
    window.addEventListener('focus', onFocus);
    const timer = window.setInterval(() => void refresh(false), ALERT_POLL_MS);
    return () => { window.removeEventListener('bmb-order-request-change', onChange); window.removeEventListener('storage', onChange); window.removeEventListener('focus', onFocus); window.clearInterval(timer); window.speechSynthesis?.cancel(); audioContextRef.current?.close().catch(() => undefined); };
  }, [alertsEnabled]);

  return <>
    <div className="sticky top-2 z-[100] mx-1 mb-3 flex items-center justify-between gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-3 py-2 shadow-md">
      <div className="flex items-center gap-2"><BellRing className="w-5 h-5 text-amber-700" /><div><div className="text-xs font-black text-amber-900">{pendingOrders.length ? `${pendingOrders.length} NEW ORDER${pendingOrders.length > 1 ? 'S' : ''} WAITING` : 'No pending orders'}</div><div className="text-[9px] text-amber-800">Pending orders remain here until accepted or declined.</div></div></div>
      <button type="button" onClick={enableAlerts} className={`shrink-0 rounded-xl px-3 py-2 text-[10px] font-black border ${alertsEnabled ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-amber-400 text-black border-amber-500'}`}>{alertsEnabled ? '🔔 On' : '🔔 Enable'}</button>
    </div>
    {pendingOrders.length > 0 && <div className="space-y-3 mb-4">{pendingOrders.map(order => <div key={order.id} className="rounded-2xl border-2 border-amber-400 bg-white p-4 shadow-lg"><div className="flex items-start justify-between gap-3"><div><div className="text-[10px] font-black uppercase tracking-widest text-amber-700">🔔 New Order Request</div><div className="mt-1 text-lg font-black text-[#124E33]">{order.customerName || 'Customer'}</div><div className="text-xs font-bold">Order: {order.id}</div><div className="text-xs font-bold">{order.planOrMeal} • ₹{Number(order.amount || 0).toLocaleString('en-IN')}</div><div className="mt-2 flex items-center gap-1 text-[10px] text-gray-500"><Clock3 className="w-3 h-3" /> Waiting for approval</div></div></div><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" disabled={busyId === order.id} onClick={() => void handleStatus(order, 'Approved')} className="rounded-xl bg-[#124E33] py-3 text-xs font-black text-white disabled:opacity-50 flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4" /> ACCEPT ORDER</button><button type="button" disabled={busyId === order.id} onClick={() => void handleStatus(order, 'Declined')} className="rounded-xl border-2 border-rose-200 bg-rose-50 py-3 text-xs font-black text-rose-800 disabled:opacity-50 flex items-center justify-center gap-1"><XCircle className="w-4 h-4" /> DECLINE</button></div><div className="mt-2 text-[9px] text-gray-400">{formatNewOrderAlert(order)}</div></div>)}</div>}
  </>;
};
