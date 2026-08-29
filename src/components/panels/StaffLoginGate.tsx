import React, { useMemo, useState } from 'react';
import { LockKeyhole, ShieldCheck, LogIn, AlertCircle } from 'lucide-react';
import { getSupabasePublishableKey, getSupabaseUrl, STAFF_SESSION_STORAGE_KEY } from '../../cms/supabaseRest';
import type { ActiveRole } from '../../types';

type StaffRouteRole = Exclude<ActiveRole, 'customer'>;

interface StaffLoginGateProps {
  role: StaffRouteRole;
  children: React.ReactNode;
}

interface StaffSession {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user_id?: string;
  role: string;
  expires_at?: number;
}

function readSession(): StaffSession | null {
  try {
    const raw = localStorage.getItem(STAFF_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StaffSession;
    if (!session.access_token) return null;
    if (session.expires_at && Date.now() >= session.expires_at) return null;
    return session;
  } catch {
    return null;
  }
}

const apiRole = (role: StaffRouteRole) => role === 'd_admin' ? 'd_admin' : role;

export const StaffLoginGate: React.FC<StaffLoginGateProps> = ({ role, children }) => {
  const existing = useMemo(() => readSession(), []);
  const [session, setSession] = useState<StaffSession | null>(existing?.role === apiRole(role) ? existing : null);
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (session) return <>{children}</>;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(pin)) {
      setError('Please enter the configured 6-digit staff PIN.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`${getSupabaseUrl()}/functions/v1/staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: getSupabasePublishableKey() },
        body: JSON.stringify({ role: apiRole(role), pin })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.access_token) throw new Error(data.error || 'Staff authentication failed.');
      const next: StaffSession = { ...data, expires_at: Date.now() + Math.max(60, Number(data.expires_in || 3600) - 30) * 1000 };
      localStorage.setItem(STAFF_SESSION_STORAGE_KEY, JSON.stringify(next));
      setSession(next);
      window.dispatchEvent(new Event('bmb-staff-auth-change'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Staff authentication failed.');
    } finally {
      setBusy(false);
    }
  };

  const title = role === 'd_admin' ? 'D-Admin' : role === 'admin' ? 'Admin' : role === 'manager' ? 'Manager' : 'Chef';
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF7F2] flex items-center justify-center p-5">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-3xl border-2 border-[#124E33] shadow-xl p-7 space-y-5">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#124E33] text-[#F2C94C] flex items-center justify-center"><LockKeyhole className="w-8 h-8" /></div>
          <h1 className="mt-4 text-2xl font-black text-[#124E33]">{title} Secure Login</h1>
          <p className="text-xs text-gray-500 mt-1">Authorized staff only. Your role controls the data and actions available.</p>
        </div>
        <label className="block text-sm font-bold text-gray-700">6-digit staff PIN<input autoFocus inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-center text-xl tracking-[0.45em] font-black outline-none focus:border-[#124E33]" placeholder="••••••" /></label>
        {error && <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-800 p-3 text-xs font-semibold flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
        <button type="submit" disabled={busy || pin.length !== 6} className="w-full py-3 rounded-xl bg-[#124E33] hover:bg-[#0A2A1B] disabled:opacity-50 text-white font-black flex items-center justify-center gap-2"><LogIn className="w-4 h-4" />{busy ? 'Signing in…' : `Enter ${title} Panel`}</button>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-semibold"><ShieldCheck className="w-4 h-4" />Supabase-authenticated staff session</div>
      </form>
    </div>
  );
};
