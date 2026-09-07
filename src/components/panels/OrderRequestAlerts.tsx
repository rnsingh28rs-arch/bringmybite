import React, { useEffect, useRef, useState } from 'react';
import { getStoredOrders, StoredOrder } from '../../utils/orderStore';
import { formatNewOrderAlert, getNewOrders } from '../../utils/orderAlerts.mjs';

const ALERT_POLL_MS = 5000;

export const OrderRequestAlerts: React.FC = () => {
  const knownIdsRef = useRef<Set<string> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [alertOrder, setAlertOrder] = useState<StoredOrder | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(false);

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
    } catch {
      setAlertsEnabled(false);
    }
  };

  const playAlert = () => {
    try {
      const context = audioContextRef.current;
      if (!context || context.state !== 'running') return;
      const now = context.currentTime;
      [880, 1174, 1568].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        const start = now + index * 0.12;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.2);
      });
    } catch {
      // Audio is optional and must never affect order handling.
    }
  };

  const announce = (order: StoredOrder) => {
    setAlertOrder(order);
    window.setTimeout(() => setAlertOrder((current) => current?.id === order.id ? null : current), 9000);
    playAlert();

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Bring My Bite — New Order Request', {
          body: `${order.customerName || 'Customer'} • ${order.id} • ₹${Number(order.amount || order.totalPrice || 0).toLocaleString('en-IN')}`,
          tag: `bmb-order-${order.id}`,
        });
      } catch {
        // Notification is optional.
      }
    }

    if (alertsEnabled && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`New order request from ${order.customerName || 'customer'}. Order ${order.id}.`);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech is optional.
      }
    }
  };

  const checkForOrders = async () => {
    const orders = await getStoredOrders();
    if (!knownIdsRef.current) {
      knownIdsRef.current = new Set(orders.map((order) => order.id));
      return;
    }
    const newOrders = getNewOrders(knownIdsRef.current, orders);
    orders.forEach((order) => knownIdsRef.current?.add(order.id));
    newOrders.forEach(announce);
  };

  useEffect(() => {
    void checkForOrders();
    const onChange = () => void checkForOrders();
    window.addEventListener('bmb-order-request-change', onChange);
    window.addEventListener('storage', onChange);
    const timer = window.setInterval(() => void checkForOrders(), ALERT_POLL_MS);
    return () => {
      window.removeEventListener('bmb-order-request-change', onChange);
      window.removeEventListener('storage', onChange);
      window.clearInterval(timer);
      window.speechSynthesis?.cancel();
      audioContextRef.current?.close().catch(() => undefined);
    };
  }, []);

  return (
    <>
      <div className="fixed right-4 top-24 z-[100]">
        <button type="button" onClick={enableAlerts} className={`rounded-xl px-3 py-2 text-xs font-black shadow-lg border ${alertsEnabled ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-amber-400 text-black border-amber-500'}`}>
          {alertsEnabled ? '🔔 Alerts Enabled' : '🔔 Enable Order Alerts'}
        </button>
      </div>
      {alertOrder && (
        <div className="fixed inset-0 z-[110] pointer-events-none flex items-start justify-center pt-28 px-4">
          <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-white border-4 border-amber-400 shadow-2xl p-5 animate-pulse">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-black tracking-widest text-amber-700 uppercase">🔔 New Order Request</div>
                <div className="text-xl font-black text-[#5C1111] mt-1">{alertOrder.customerName || 'Customer'}</div>
                <div className="text-sm font-bold mt-1">Order: {alertOrder.id}</div>
                <div className="text-sm font-bold">Amount: ₹{Number(alertOrder.amount || alertOrder.totalPrice || 0).toLocaleString('en-IN')}</div>
              </div>
              <button type="button" onClick={() => setAlertOrder(null)} className="text-gray-500 text-xl font-black">×</button>
            </div>
            <div className="mt-4 text-xs text-gray-600">The order has been added to Order Requests. Open that tab to review it.</div>
          </div>
        </div>
      )}
    </>
  );
};
