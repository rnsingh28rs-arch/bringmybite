import React, { useMemo, useState } from 'react';
import { CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import { getSupabasePublishableKey, getSupabaseUrl } from '../cms/supabaseRest';

export const StaffPasswordReset: React.FC = () => {
  const recovery = useMemo(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const query = new URLSearchParams(window.location.search);
    return {
      accessToken: hash.get('access_token') || query.get('access_token') || '',
      type: hash.get('type') || query.get('type') || '',
      error: hash.get('error_description') || query.get('error_description') || '',
      errorCode: hash.get('error_code') || query.get('error_code') || '',
    };
  }, []);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const tokenReady = Boolean(recovery.accessToken) && (!recovery.type || recovery.type === 'recovery');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password.length < 8) { setError('Use at least 8 characters for your new password.'); return; }
    if (password !== confirmPassword) { setError('New password and confirm password do not match.'); return; }
    if (!tokenReady) { setError('This reset link is invalid or expired. Return to D-Admin login and request a new link.'); return; }
    setBusy(true);
    try {
      const response = await fetch(`${getSupabaseUrl()}/auth/v1/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', apikey: getSupabasePublishableKey(), Authorization: `Bearer ${recovery.accessToken}` },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.msg || data.message || data.error_description || 'The password could not be updated. The reset link may have expired.');
      setSaved(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to reset password. Please request a new link.');
    } finally { setBusy(false); }
  };

  return <div className="min-h-[100dvh] bg-[#FAF7F2] flex items-center justify-center p-5">
    <form onSubmit={submit} className="w-full max-w-md bg-white rounded-3xl border border-[#E5DAC6] shadow-xl p-6 space-y-5">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-[#124E33] text-[#F2C94C] flex items-center justify-center">{saved ? <CheckCircle2 className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}</div>
        <h1 className="mt-4 text-2xl font-black text-[#124E33]">{saved ? 'Password updated' : 'Create a new password'}</h1>
        <p className="mt-1 text-sm text-gray-500">{saved ? 'Your password has been changed. You can now sign in with it.' : 'Choose a new password for your Bring My Bite staff account.'}</p>
      </div>
      {saved ? <a href="/dadmin" className="block w-full rounded-xl bg-[#124E33] py-3.5 text-center text-white font-black">Return to D-Admin login</a> : <>
        {recovery.error || recovery.errorCode ? <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm font-semibold text-rose-800">{decodeURIComponent(recovery.error.replace(/\+/g, ' ')) || 'This reset link is invalid or has expired.'}</div> : null}
        {!tokenReady && <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">Open this page from the password-reset email. If the link says expired, request a fresh one from the login screen.</div>}
        <label className="block text-sm font-bold text-gray-700">New password<div className="relative mt-2"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="password" autoComplete="new-password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border-2 border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-[#124E33]" placeholder="At least 8 characters" required /></div></label>
        <label className="block text-sm font-bold text-gray-700">Confirm new password<input type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-2 w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-[#124E33]" placeholder="Enter the same password again" required /></label>
        {error && <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm font-semibold text-rose-800">{error}</div>}
        <button type="submit" disabled={busy || !tokenReady || !password || !confirmPassword} className="w-full rounded-xl bg-[#124E33] py-3.5 text-white font-black disabled:opacity-50">{busy ? 'Updating password…' : 'Save new password'}</button>
      </>}
      <p className="text-center text-xs text-gray-500">For security, reset links expire. Request a new link if this one no longer works.</p>
    </form>
  </div>;
};
