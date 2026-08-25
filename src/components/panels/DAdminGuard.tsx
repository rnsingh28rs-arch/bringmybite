import React, { useEffect, useState } from 'react';
import { isSupabaseConfigured, restoreSession, signIn, signOut, supabaseSelect } from '../../cms/supabaseRest';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

type AdminAccount = { user_id:string; email:string; role_id:string; active:boolean };

export const DAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    restoreSession();
    setReady(true);
    // A stored token is not trusted by itself. D-Admin access is granted only
    // after a fresh Auth identity is matched to bmb_admin_users on login.
    setAuthorized(false);
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const auth = await signIn(email.trim(), password);
      const rows = await supabaseSelect<AdminAccount>('bmb_admin_users', `select=user_id,email,role_id,active&user_id=eq.${encodeURIComponent(auth.id)}&limit=1`);
      const account = rows[0];
      if (!account?.active || account.role_id !== 'ceo-director') {
        signOut();
        throw new Error('This account is not authorized for CEO Cum Director / D-Admin.');
      }
      setAuthorized(true);
    } catch (err) {
      setAuthorized(false);
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally { setBusy(false); }
  };

  if (!ready) return <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]"><div className="font-bold text-[#124E33]">Checking secure D-Admin session…</div></div>;
  if (!isSupabaseConfigured) return <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC] p-5"><div className="max-w-md bg-white rounded-3xl border border-amber-200 shadow-xl p-7 text-center"><AlertTriangle className="w-8 h-8 mx-auto text-amber-600"/><h1 className="text-xl font-black text-[#124E33] mt-3">D-Admin is locked</h1><p className="text-sm text-gray-600 mt-2">Supabase authentication must be configured before the control centre can be opened.</p></div></div>;
  if (authorized) return <>{children}</>;

  return <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center p-5"><form onSubmit={login} className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl p-7 space-y-4"><div className="w-12 h-12 rounded-2xl bg-[#0C3822] text-[#F2C94C] flex items-center justify-center"><Lock className="w-6 h-6"/></div><div><div className="text-[10px] uppercase tracking-[0.22em] text-amber-600 font-black">D-ADMIN DESIGNER</div><h1 className="text-2xl font-black text-[#124E33] mt-1">CEO Cum Director Login</h1><p className="text-sm text-gray-500 mt-1">Only the authenticated Supabase user assigned the <b>ceo-director</b> role can enter.</p></div><input className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" type="email" required autoComplete="username" placeholder="CEO email" value={email} onChange={e=>setEmail(e.target.value)}/><input className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" type="password" required autoComplete="current-password" placeholder="Password / PIN" value={password} onChange={e=>setPassword(e.target.value)}/>{error&&<div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">{error}</div>}<button disabled={busy} className="w-full py-3 rounded-xl bg-[#124E33] disabled:opacity-60 text-white font-black flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4 text-[#F2C94C]"/>{busy?'Checking…':'Secure Sign in'}</button><p className="text-[11px] text-gray-400 text-center">Credentials are not stored in the frontend.</p></form></div>;
};
