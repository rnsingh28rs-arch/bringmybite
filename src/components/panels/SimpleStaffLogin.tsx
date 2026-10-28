import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, LogIn, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import { getSupabasePublishableKey, getSupabaseUrl, logoutStaffSession, STAFF_SESSION_STORAGE_KEY } from '../../cms/supabaseRest';
import type { ActiveRole } from '../../types';
import { getStaffDatabaseRole, isStaffSessionShapeValid } from '../../utils/staffSession.mjs';

type StaffRouteRole = Exclude<ActiveRole, 'customer'>;
interface Props { role: StaffRouteRole; children: React.ReactNode; }
interface Session { role: StaffRouteRole; username: string; access_token: string; refresh_token: string; expires_at: number; }
const titles: Record<StaffRouteRole, string> = { admin: 'Admin', d_admin: 'D-Admin', manager: 'Manager', chef: 'Chef' };
export const SimpleStaffLogin: React.FC<Props> = ({ role, children }) => {
  const [session, setSession] = useState<Session | null>(() => { try { const saved = JSON.parse(localStorage.getItem(STAFF_SESSION_STORAGE_KEY) || 'null') as Session | null; if (saved && saved.role !== role) { localStorage.removeItem(STAFF_SESSION_STORAGE_KEY); return null; } if (!isStaffSessionShapeValid(saved, role)) { if (saved) localStorage.removeItem(STAFF_SESSION_STORAGE_KEY); return null; } return saved; } catch { localStorage.removeItem(STAFF_SESSION_STORAGE_KEY); return null; } });
  const [sessionVerified, setSessionVerified] = useState(false);
  const [sessionVerificationError, setSessionVerificationError] = useState('');
  const [verificationRetry, setVerificationRetry] = useState(0);
  const [username, setUsername] = useState(role === 'd_admin' ? 'dadmin' : role); const [password, setPassword] = useState(''); const [show, setShow] = useState(false); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [forgotMode, setForgotMode] = useState(false); const [recoveryEmail, setRecoveryEmail] = useState(''); const [recoverySent, setRecoverySent] = useState(false);
  useEffect(() => {
    if (!session) { setSessionVerified(false); setSessionVerificationError(''); return; }
    let cancelled = false;
    let verifying = false;
    setSessionVerified(false);
    setSessionVerificationError('');
    const rejectSession = (message: string) => {
      localStorage.removeItem(STAFF_SESSION_STORAGE_KEY);
      window.dispatchEvent(new Event('bmb-staff-session-change'));
      void logoutStaffSession();
      if (!cancelled) { setSession(null); setError(message); }
    };
    const verifySession = async (initial = false) => {
      if (cancelled || verifying) return;
      verifying = true;
      if (initial) { setSessionVerified(false); setSessionVerificationError(''); }
      try {
        const authResponse = await fetch(`${getSupabaseUrl()}/auth/v1/user`, {
          headers: { apikey: getSupabasePublishableKey(), Authorization: `Bearer ${session.access_token}` },
        });
        if (authResponse.status === 401 || authResponse.status === 403) {
          rejectSession('Your staff session is no longer valid. Please sign in again.');
          return;
        }
        if (!authResponse.ok) throw new Error(`Authentication verification failed (${authResponse.status}).`);
        const user = await authResponse.json().catch(() => ({}));
        if (typeof user.id !== 'string' || !user.id) {
          rejectSession('Your staff session is invalid. Please sign in again.');
          return;
        }

        const accountResponse = await fetch(`${getSupabaseUrl()}/rest/v1/rpc/bmb_get_staff_account`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: getSupabasePublishableKey(), Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({}),
        });
        if (accountResponse.status === 401 || accountResponse.status === 403) {
          rejectSession('Your staff permissions have changed. Please sign in again.');
          return;
        }
        if (!accountResponse.ok) throw new Error(`Staff authorization verification failed (${accountResponse.status}).`);
        const result = await accountResponse.json().catch(() => []);
        const account = Array.isArray(result) ? result[0] : result;
        if (!account || account.user_id !== user.id || account.role_id !== getStaffDatabaseRole(role) || account.active !== true) {
          rejectSession('This account is no longer authorized for this panel. Please sign in again.');
          return;
        }
        if (!cancelled) { setSessionVerified(true); setSessionVerificationError(''); }
      } catch {
        if (!cancelled && initial) setSessionVerificationError('Could not verify your staff session. Check your connection and retry.');
      } finally {
        verifying = false;
      }
    };
    void verifySession(true);
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void verifySession(false);
    }, 60_000);
    const onFocus = () => void verifySession(false);
    const onStorage = () => void verifySession(false);
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, [session?.access_token, role, verificationRetry]);

  useEffect(() => {
    if (!session?.refresh_token) return;
    let cancelled = false;
    const refreshIfNeeded = async () => {
      if (session.expires_at - Date.now() > 120_000) return;
      try {
        const response = await fetch(`${getSupabaseUrl()}/auth/v1/token?grant_type=refresh_token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: getSupabasePublishableKey() },
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          if (response.status === 400 || response.status === 401) {
            void logoutStaffSession();
            if (!cancelled) {
              setSession(null);
              setError('Your staff session expired. Please sign in again.');
            }
          }
          return;
        }
        if (typeof data.access_token !== 'string' || typeof data.refresh_token !== 'string') return;
        const next: Session = {
          ...session,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: Date.now() + Number(data.expires_in || 3600) * 1000,
        };
        localStorage.setItem(STAFF_SESSION_STORAGE_KEY, JSON.stringify(next));
        if (!cancelled) setSession(next);
      } catch {
        // Keep the current session on temporary network failures; retry on the next interval.
      }
    };
    void refreshIfNeeded();
    const timer = window.setInterval(() => void refreshIfNeeded(), 30_000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [session?.expires_at, session?.refresh_token]);

  if (session && sessionVerified) return <>{children}</>;
  if (session) return <div className="min-h-[100dvh] bg-[#FAF7F2] flex items-center justify-center p-5"><div className="w-full max-w-sm rounded-3xl border border-[#E5DAC6] bg-white p-6 text-center shadow-xl"><ShieldCheck className="mx-auto h-8 w-8 text-[#124E33]" /><h1 className="mt-3 text-lg font-black text-[#124E33]">Verifying staff session</h1><p className="mt-2 text-sm text-gray-600">{sessionVerificationError || 'Checking your current login and staff permissions…'}</p>{sessionVerificationError && <div className="mt-4 flex gap-2"><button type="button" onClick={() => setVerificationRetry(value => value + 1)} className="flex-1 rounded-xl bg-[#124E33] px-3 py-2 text-sm font-bold text-white">Retry</button><button type="button" onClick={async () => { await logoutStaffSession(); setSession(null); setSessionVerificationError(''); setError('Please sign in again.'); }} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold text-gray-700">Sign in again</button></div>}</div></div>;
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setError(''); if (!username.trim() || !password) { setError('Enter username and password.'); return; } setBusy(true); try { const response = await fetch(`${getSupabaseUrl()}/functions/v1/staff-login`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: getSupabasePublishableKey() }, body: JSON.stringify({ role, username: username.trim().toLowerCase(), password }) }); const data = await response.json().catch(() => ({})); if (!response.ok || data.role !== role || typeof data.access_token !== 'string' || data.access_token.length < 20) throw new Error(data.error || 'Invalid username or password.'); if (typeof data.refresh_token !== 'string' || data.refresh_token.length < 20) throw new Error('The authentication service did not return a refresh token. Please contact the administrator.');
      const next: Session = { role, username: data.username, access_token: data.access_token, refresh_token: data.refresh_token, expires_at: Date.now() + Number(data.expires_in || 3600) * 1000 }; localStorage.setItem(STAFF_SESSION_STORAGE_KEY, JSON.stringify(next)); setPassword(''); setSession(next); window.location.reload(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to sign in.'); } finally { setBusy(false); } };
  const sendRecovery = async (event: React.FormEvent) => { event.preventDefault(); setError(''); if (!recoveryEmail.trim() || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(recoveryEmail.trim())) { setError('Enter a valid registered email address.'); return; } setBusy(true); try { const redirectTo = `${window.location.origin}/reset-password`; const response = await fetch(`${getSupabaseUrl()}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: getSupabasePublishableKey() }, body: JSON.stringify({ email: recoveryEmail.trim().toLowerCase() }) }); if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.msg || data.message || data.error_description || 'Could not send the reset email. Check Supabase email and redirect settings.'); } setRecoverySent(true); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to send reset email.'); } finally { setBusy(false); } };
  if (forgotMode) return <div className="min-h-[100dvh] bg-[#FAF7F2] flex items-center justify-center p-5"><form onSubmit={sendRecovery} className="w-full max-w-sm bg-white rounded-3xl border border-[#E5DAC6] shadow-xl p-6 space-y-5"><div className="text-center"><div className="mx-auto h-14 w-14 rounded-2xl bg-[#124E33] text-[#F2C94C] flex items-center justify-center"><Mail className="w-7 h-7" /></div><h1 className="mt-4 text-2xl font-black text-[#124E33]">Reset your password</h1><p className="mt-1 text-sm text-gray-500">Enter the registered staff email. We’ll email a secure reset link.</p></div>{recoverySent ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">If this email is registered, a password reset link has been sent. Open it on this website to set a new password.</div> : <label className="block text-sm font-bold text-gray-700">Registered email<input type="email" autoComplete="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-[#124E33]" placeholder="staff@example.com" required /></label>}{error && <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800">{error}</div>}{!recoverySent && <button type="submit" disabled={busy || !recoveryEmail.trim()} className="w-full rounded-xl bg-[#124E33] py-3.5 text-white font-black flex items-center justify-center gap-2 disabled:opacity-50"><Mail className="w-4 h-4" />{busy ? 'Sending link…' : 'Send reset link'}</button>}<button type="button" onClick={() => { setForgotMode(false); setError(''); setRecoverySent(false); }} className="w-full rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" />Back to login</button><button type="button" onClick={() => { setForgotMode(true); setError(''); }} className="w-full -mt-2 text-sm font-bold text-[#124E33] underline underline-offset-4">Forgot Password?</button></form></div>;
  return <div className="min-h-[100dvh] bg-[#FAF7F2] flex items-center justify-center p-5"><form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl border border-[#E5DAC6] shadow-xl p-6 space-y-5"><div className="text-center"><div className="mx-auto h-14 w-14 rounded-2xl bg-[#124E33] text-[#F2C94C] flex items-center justify-center"><ShieldCheck className="w-7 h-7" /></div><h1 className="mt-4 text-2xl font-black text-[#124E33]">{titles[role]} Login</h1><p className="mt-1 text-xs text-gray-500">Username and password only.</p></div><label className="block text-sm font-bold text-gray-700">Username<input autoFocus autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-[#124E33]" /></label><label className="block text-sm font-bold text-gray-700">Password<div className="relative mt-2"><input type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 outline-none focus:border-[#124E33]" /><button type="button" onClick={() => setShow(v => !v)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 p-2">{show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></label>{error && <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800">{error}</div>}<button type="submit" disabled={busy || !username.trim() || !password} className="w-full rounded-xl bg-[#124E33] py-3.5 text-white font-black flex items-center justify-center gap-2 disabled:opacity-50"><LogIn className="w-4 h-4" />{busy ? 'Signing in…' : `Enter ${titles[role]} Panel`}</button></form></div>;
};
