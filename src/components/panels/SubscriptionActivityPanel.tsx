import React, { useMemo } from 'react';
import type { Subscription } from '../../types';
import { CalendarDays, CheckCircle2, Clock3, UsersRound } from 'lucide-react';
import { getSubscriptionActivityMetrics, getSubscriptionDay } from '../../utils/subscriptionActivity.mjs';

type Props = { subscriptions: Subscription[] };

const formatDate = (value: string) => {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const SubscriptionActivityPanel: React.FC<Props> = ({ subscriptions }) => {
  const today = new Date();
  const stats = useMemo(() => getSubscriptionActivityMetrics(subscriptions, today), [subscriptions]);
  const activeSubscriptions = useMemo(() => [...subscriptions]
    .filter(s => s.active && s.verificationStatus === 'Approved')
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()), [subscriptions]);

  return (
    <section className="bg-white rounded-2xl border-2 border-emerald-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b bg-gradient-to-r from-emerald-50 to-white">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600"/><h3 className="font-black text-base uppercase tracking-wide">Subscription Activity</h3></div>
            <p className="text-[11px] text-gray-500 mt-1">A dedicated view for monthly subscriptions — separate from Instant Order Requests.</p>
          </div>
          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">Live</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <Metric label="Active" value={stats.active} />
          <Metric label="New Today" value={stats.newToday} />
          <Metric label="Started This Week" value={stats.startedThisWeek} />
          <Metric label="Expiring Soon" value={stats.expiringSoon} />
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {activeSubscriptions.map(s => {
            const day = getSubscriptionDay(s.startDate, today);
            const expiry = new Date(`${s.expiryDate.slice(0, 10)}T00:00:00`);
            const todayMidnight = new Date(`${today.toISOString().slice(0, 10)}T00:00:00`);
            const daysRemaining = Number.isNaN(expiry.getTime()) ? null : Math.ceil((expiry.getTime() - todayMidnight.getTime()) / 86400000);
            const isNew = day === 1;
            const expiring = daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 3;

            return (
              <article key={s.id} className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-emerald-50/40 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div><div className="font-black text-sm text-gray-900">{s.customerName}</div><div className="text-[11px] text-gray-500">{s.packageType}</div></div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {isNew && <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-1 rounded-full">NEW</span>}
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3"/> ACTIVE</span>
                  </div>
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <div className="text-2xl font-black text-[#124E33]">Day {day}</div>
                  <div className="text-[10px] font-bold text-gray-400 pb-1 uppercase">of subscription</div>
                </div>

                <div className="mt-3 space-y-1.5 text-[11px] text-gray-600">
                  <div className="flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5"/> Started: <b>{formatDate(s.startDate)}</b></div>
                  <div className="flex items-center gap-2"><Clock3 className="w-3.5 h-3.5"/> Expires: <b>{formatDate(s.expiryDate)}</b></div>
                  <div className="flex items-center gap-2"><UsersRound className="w-3.5 h-3.5"/> {s.mealPreference} • ₹{Number(s.amountPaid || 0).toLocaleString('en-IN')}</div>
                </div>

                {expiring && <div className="mt-3 text-[10px] font-black uppercase text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-2.5 py-2">Expires in {daysRemaining === 0 ? 'today' : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`}</div>}
              </article>
            );
          })}
          {activeSubscriptions.length === 0 && <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">No active subscriptions yet.</div>}
        </div>
      </div>
    </section>
  );
};

const Metric: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="rounded-xl border bg-white p-3">
    <div className="text-[10px] uppercase font-bold text-gray-500">{label}</div>
    <div className="text-2xl font-black text-gray-900 mt-1">{value}</div>
  </div>
);

export default SubscriptionActivityPanel;
