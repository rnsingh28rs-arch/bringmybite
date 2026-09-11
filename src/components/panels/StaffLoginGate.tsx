import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { getSupabasePublishableKey, getSupabaseUrl, STAFF_SESSION_STORAGE_KEY } from '../../cms/supabaseRest';
import type { ActiveRole } from '../../types';

type StaffRouteRole = Exclude<ActiveRole, 'customer'>;
interface StaffLoginGateProps { role: StaffRouteRole; children: React.ReactNode; }
interface StaffSession {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user_id?: string;
  username?: string;
  role: string;
  auth_version: 2;
}

const roleConfig: Record<StaffRouteRole, { title: string; dbRole: string; usernameHint: string }> = {
  admin: { title: 'Admin', dbRole: 'admin', usernameHint: 'admin' },
  manager: { title: 'Manager', dbRole: 'manager', usernameHint: 'manager' },
  chef: { title: 'Chef', dbRole: 'chef', usernameHint: 'chef' },
  d_admin: { title: 'D-Admin', dbRole: 'ceo-director', usernameHint: 'dadmin' },
};

function readSession(): StaffSession | null {
  try {
    const raw = localStorage.getItem(STAFF_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Partial<StaffSession>;
    if (session.auth_version !== 2 || typeof session.access_token !== 'string' || !session.access_token) return null;
    return session as StaffSession;
  } catch {
    return null;
  }
}

function saveSession(session: StaffSession) {
  localStorage.setItem(STAFF_SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STAFF_SESSION_STORAGE_KEY);
}

async function verifySession(session: StaffSession, expectedRole: string): Promise<StaffSession | null> {
  if (session.role !== expectedRole) return null;
  if (session.expires_at && Date.now() < Number(session.expires_at) * 1000 - 30000) return session;

  if (!session.refresh_token) return null;
  try {
    const response = await fetch(`${getSupabaseUrl()}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: getSupabasePublishableKey() },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.access_token) return null;
    const refreshed: StaffSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || session.refresh_token,
      expires_in: Number(data.expires_in || 3600),
      expires_at: Number(data.expires_at || Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600)),
      user_id: session.user_id,
      username: session.username,
      role: session.role,
      auth_version: 2,
    };
    saveSession(refreshed);
    return refreshed;
  } catch {
    return null;
  }
}

export const StaffLoginGate: React.FC<StaffLoginGateProps> = ({ role, children }) => {
  const config = roleConfig[role];
  const [session, setSession] = useState<StaffSession | null>(null);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState(config.usernameHint);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const existing = readSession();
    if (!existing) {
      setChecking(false);
      return;
    }
    void verifySession(existing, role).then(valid => {
      if (cancelled) return;
      if (valid) setSession(valid);
      else clearSession();
      setChecking(false);
    });
    return () => { cancelled = true; };
  }, [role]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const normalizedUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{2,64}$/.test(normalizedUsername)) {
      setError('Enter the staff username from the database.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(`${getSupabaseUrl()}/functions/v1/staff-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: getSupabasePublishableKey() },
        body: JSON.stringify({ role, username: normalizedUsername, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.access_token || data.role !== role) {
        throw new Error(data.error || 'Invalid username or password.');
      }
      const next: StaffSession = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: Number(data.expires_in || 3600),
        expires_at: Number(data.expires_at || Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600)),
        user_id: data.user_id,
        username: data.username || normalizedUsername,
        role: data.role,
        auth_version: 2,
      };
      saveSession(next);
      setPassword('');
      setSession(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return <div className="min-h-[100dvh] bg-[#FAF7F2] flex items-center justify-center p-5 text-sm font-bold text-[#124E33]">Checking secure staff session…</div>;
  }

  if (session) return <>{children}</>;

  return (
    <div className="min-h-[100dvh] bg-[#FAF7F2] flex items-center justify-center p-5">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-[2rem] border border-[#E5DAC6] shadow-2xl p-7 space-y-5">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#124E33] text-[#F2C94C] flex items-center justify-center shadow-lg">
            <LockKeyhole className="w-8 h-8" />
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.25em] font-black text-[#C88A24]">Bring My Bite Panel</p>
          <h1 className="mt-1 text-3xl font-black text-[#124E33]">{config.title} Login</h1>
          <p className="text-xs text-gray-500 mt-2">Sign in with the staff account assigned to this panel.</p>
        </div>

        <label className="block text-sm font-bold text-gray-700">
          Username
          <input
            autoFocus
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-[#124E33]"
            placeholder={config.usernameHint}
          />
        </label>

        <label className="block text-sm font-bold text-gray-700">
          Password
          <div className="relative mt-2">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 outline-none focus:border-[#124E33]"
              placeholder="Enter your password"
            />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(value => !value)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </label>

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-800 p-3 text-xs font-semibold flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button type="submit" disabled={busy || !username.trim() || password.length < 8} className="w-full py-3.5 rounded-xl bg-[#124E33] hover:bg-[#0A2A1B] disabled:opacity-50 text-white font-black flex items-center justify-center gap-2 shadow-lg">
          <LogIn className="w-4 h-4" />
          {busy ? 'Signing in…' : `Enter ${config.title} Panel`}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          Database role + Supabase Auth protected
        </div>
      </form>
    </div>
  );
};
