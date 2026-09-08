import React, { useMemo } from 'react';
import type { Subscription } from '../../types';
import { CalendarDays, CheckCircle2, Clock3, Users } from 'lucide-react';

type Props = { subscriptions: Subscription[] };

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const dayNumber = (startDate: string) => {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 1;
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((today.getTime() - start.getTime()) / 86400000) + 1);
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const SubscriptionActivityPanel: React.FC<Props> = ({ subscriptions }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const week = startOfWeek(now);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    return {
      active: subscriptions.filter(s => s.active).length,
      today: subscriptions.filter(s => { const d = new Date(s.startDate); d.setHours(0,0,0,0); return d.getTime() === today.getTime(); }).length,
      week: subscriptions.filter(s => { const d = new Date(s.startDate); return !Number.isNaN(d.getTime()) && d >= week; }).length,
      expiring: subscriptions.filter(s => { const d = new Date(s.expiryDate).getTime(); return s.active && d >= now.getTime() && d <= now.getTime() + 7 * 86400000; }).length,
    };
  }, [subscriptions]);

  const recent = useMemo(() => [...subscriptions]
    .filter(s => s.active)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()), [subscriptions]);

  return (
    <section className="bg-white rounded-2xl border-2 border-emerald-100 shadow-sm p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600"/><h3 className="font-black text-base uppercase tracking-wide">Subscription Activity</h3></div>
          <p className="text-[11px] text-gray-500 mt-1">Subscriptions are tracked separately from Instant Order Requests.</p>
        </div>
        <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">Live from customer subscriptions</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border bg-emerald-50/60 p-3"><div className="text-[10px] uppercase font-bold text-gray-500">Active</div><div className="text-2xl font-black text-emerald-800">{stats.active}</div></div>
        <div className="rounded-xl border bg-blue-50/60 p-3"><div className="text-[10px] uppercase font-bold text-gray-500">New Today</div><div className="text-2xl font-black text-blue-800">{stats.today}</div></div>
        <div className="rounded-xl border bg-amber-50/60 p-3"><div className="text-[10px] uppercase font-bold text-gray-500">This Week</div><div className="text-2xl font-black text-amber-800">{stats.week}</div></div>
        <div className="rounded-xl border bg-rose-50/60 p-3"><div className="text-[10px] uppercase font-bold text-gray-500">Expiring ≤ 7 Days</div><div className="text-2xl font-black text-rose-800">{stats.expiring}</div></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {recent.map(s => (
          <div key={s.id} className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-4">
            <div className="flex items-start justify-between gap-2">
              <div><div className="font-black text-sm text-gray-900">{s.customerName}</div><div className="text-[11px] text-gray-500">{s.packageType}</div></div>
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3"/> ACTIVE</span>
            </div>
            <div className="mt-4 text-2xl font-black text-[#124E33]">Day {dayNumber(s.startDate)}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">of subscription</div>
            <div className="mt-3 space-y-1.5 text-[11px] text-gray-600">
              <div className="flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5"/> Started: <b>{formatDate(s.startDate)}</b></div>
              <div className="flex items-center gap-2"><Clock3 className="w-3.5 h-3.5"/> Expires: <b>{formatDate(s.expiryDate)}</b></div>
              <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5"/> {s.mealPreference} • ₹{(s.amountPaid || 0).toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))}
        {recent.length === 0 && <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">No active subscriptions yet.</div>}
      </div>
    </section>
  );
};
