import React, { useState } from 'react';
import { KeyRound, Save, ShieldCheck } from 'lucide-react';
import { getSupabasePublishableKey, getSupabaseUrl, STAFF_SESSION_STORAGE_KEY } from '../../cms/supabaseRest';

type StaffSession = { role?: string; username?: string; access_token?: string; };
const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'ceo-director', label: 'D-Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'chef', label: 'Chef' },
];
const field = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500';

export const StaffPasswordManager: React.FC = () => {
  const [targetRole, setTargetRole] = useState('admin');
  const [targetUsername, setTargetUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  let session: StaffSession | null = null;
  try { session = JSON.parse(localStorage.getItem(STAFF_SESSION_STORAGE_KEY) || 'null'); } catch {}
  const isAdmin = session?.role === 'admin';
  const isDAdmin = session?.role === 'd_admin';
  if (!isAdmin && !isDAdmin) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage(''); setError('');
    if (password.length < 12) { setError('Use at least 12 characters.'); return; }
    if (password !== confirm) { setError('The passwords do not match.'); return; }
    if (!session?.access_token) { setError('Your session is missing. Sign in again.'); return; }
    setBusy(true);
    try {
      const response = await fetch(`${getSupabaseUrl()}/functions/v1/staff-password-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: getSupabasePublishableKey(), Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(isAdmin ? { target_role: targetRole, target_username: targetUsername.trim().toLowerCase(), new_password: password } : { new_password: password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success !== true) throw new Error(data.error || 'Password update failed.');
      setMessage('Password updated in Supabase Auth. Use the new password next time you sign in.');
      setPassword(''); setConfirm('');
    } catch (e) { setError(e instanceof Error ? e.message : 'Password update failed.'); }
    finally { setBusy(false); }
  };

  return <section className="mx-auto my-5 w-full max-w-4xl rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-100 p-3 text-emerald-800"><KeyRound className="h-5 w-5"/></div><div><h2 className="text-xl font-black text-[#124E33]">Staff Password Management</h2><p className="text-sm text-gray-500">Updates the actual Supabase Auth password.</p></div></div>
    <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
      {isAdmin && <><label className="text-sm font-bold text-gray-700">Staff role<select className={field+' mt-1'} value={targetRole} onChange={e=>{setTargetRole(e.target.value);setTargetUsername(({admin:'admin','ceo-director':'dadmin',manager:'manager',chef:'chef'} as Record<string,string>)[e.target.value]||'');}}>{roles.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}</select></label><label className="text-sm font-bold text-gray-700">Staff username<input className={field+' mt-1'} value={targetUsername} onChange={e=>setTargetUsername(e.target.value)} autoComplete="off" required/></label></>}
      {!isAdmin && <div className="md:col-span-2 rounded-xl bg-blue-50 p-3 text-sm text-blue-900"><ShieldCheck className="mr-2 inline h-4 w-4"/>D-Admin can change its own password here. Other staff password changes require Admin authorization.</div>}
      <label className="text-sm font-bold text-gray-700">New password<input className={field+' mt-1'} type="password" autoComplete="new-password" minLength={12} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} required/></label>
      <label className="text-sm font-bold text-gray-700">Confirm new password<input className={field+' mt-1'} type="password" autoComplete="new-password" minLength={12} maxLength={128} value={confirm} onChange={e=>setConfirm(e.target.value)} required/></label>
      {error && <p role="alert" className="md:col-span-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      {message && <p role="status" className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</p>}
      <button disabled={busy} className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#124E33] px-4 py-3 font-bold text-white disabled:opacity-50"><Save className="h-4 w-4"/>{busy?'Updating password…':'Update password in Supabase'}</button>
    </form>
    <p className="mt-3 text-xs text-gray-500">For safety, the change is accepted only from a valid signed-in staff session with the required role.</p>
  </section>;
};