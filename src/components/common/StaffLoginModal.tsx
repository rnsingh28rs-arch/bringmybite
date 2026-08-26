import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured, signInWithStaffCredentials } from '../../cms/supabaseRest';
import { Lock, X, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export const StaffLoginModal: React.FC = () => {
  const { isStaffLoginOpen, setIsStaffLoginOpen, setTargetStaffRole, setActiveRole } = useApp();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setErrorMsg(''); setSuccessMsg(''); setUsername(''); setPin('');
  }, [isStaffLoginOpen]);

  if (!isStaffLoginOpen) return null;

  const closeLogin = () => {
    setIsStaffLoginOpen(false); setTargetStaffRole(null); setActiveRole('customer'); setUsername(''); setPin(''); setErrorMsg(''); setSuccessMsg('');
    window.dispatchEvent(new CustomEvent('bmb:staff-login-dismissed'));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorMsg(''); setSuccessMsg('');
    if (!isSupabaseConfigured) { setErrorMsg('Staff authentication is unavailable because Supabase is not configured.'); return; }
    const cleanUsername = username.trim().toLowerCase();
    const cleanPin = pin.trim();
    if (!/^[a-z0-9][a-z0-9._-]{2,31}$/.test(cleanUsername)) { setErrorMsg('Enter your staff username.'); return; }
    if (!/^\d{6}$/.test(cleanPin)) { setErrorMsg('Enter your configured 6-digit staff PIN.'); return; }
    setBusy(true);
    try {
      const session = await signInWithStaffCredentials(cleanUsername, cleanPin);
      const effectiveRole = session.role as 'd_admin'|'admin'|'manager'|'chef';
      setActiveRole(effectiveRole);
      setSuccessMsg('Login successful.');
      window.dispatchEvent(new CustomEvent('bmb:staff-authenticated', { detail: { role: effectiveRole, userId: session.id, username: session.username } }));
      setIsStaffLoginOpen(false); setTargetStaffRole(null); setUsername(''); setPin('');
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : 'Login failed.'); }
    finally { setBusy(false); }
  };

  return <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
    <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-sm shadow-2xl border-2 border-[#124E33] overflow-hidden">
      <div className="bg-[#0C3822] text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#F2C94C] text-black flex items-center justify-center"><Lock className="w-5 h-5"/></div><div><h2 className="text-lg font-bold text-[#F2C94C]">Staff Login</h2><p className="text-xs text-emerald-200">Username + 6-digit PIN</p></div></div>
        <button type="button" aria-label="Close staff login" onClick={closeLogin} className="p-2 rounded-xl text-emerald-300 hover:text-white"><X className="w-5 h-5"/></button>
      </div>
      <form onSubmit={handleLogin} className="p-5 space-y-4">
        <div className="p-3.5 bg-white rounded-2xl border border-gray-200"><div className="font-bold text-sm text-gray-900">Secure staff access</div><p className="text-xs text-gray-600 mt-1">Your role and permissions are loaded from the central Supabase staff record.</p></div>
        <label className="block text-xs font-bold text-gray-700">Username<input className="w-full mt-1.5 px-4 py-3.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-[#124E33]" type="text" autoCapitalize="none" autoCorrect="off" autoComplete="username" placeholder="admin" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g,'').slice(0,32))} autoFocus/></label>
        <label className="block text-xs font-bold text-gray-700">6-digit PIN<input className="w-full mt-1.5 px-4 py-4 bg-white border border-gray-300 rounded-xl text-center text-2xl tracking-[0.45em] font-mono outline-none focus:ring-2 focus:ring-[#124E33]" type="password" inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} autoComplete="current-password" placeholder="••••••" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,6))}/></label>
        {errorMsg&&<div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0"/>{errorMsg}</div>}
        {successMsg&&<div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0"/>{successMsg}</div>}
        <button disabled={busy} type="submit" className="w-full py-3.5 bg-[#124E33] disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4 text-[#F2C94C]"/><span>{busy?'Signing in…':'Sign in'}</span><ArrowRight className="w-4 h-4"/></button>
        <p className="text-[11px] text-gray-400 text-center">Authentication uses the central staff username and PIN. No staff email is required.</p>
      </form>
    </div>
  </div>;
};
