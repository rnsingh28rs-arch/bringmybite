import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured, signInWithStaffPin } from '../../cms/supabaseRest';
import { ShieldAlert, Briefcase, ChefHat, Lock, X, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

type StaffRole = 'admin' | 'manager' | 'chef';

export const StaffLoginModal: React.FC = () => {
  const { isStaffLoginOpen, setIsStaffLoginOpen, targetStaffRole, setTargetStaffRole, setActiveRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<StaffRole>(targetStaffRole || 'admin');
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (targetStaffRole) setSelectedRole(targetStaffRole);
    setErrorMsg('');
    setPin('');
  }, [targetStaffRole, isStaffLoginOpen]);

  if (!isStaffLoginOpen) return null;

  const closeLogin = () => {
    setIsStaffLoginOpen(false);
    setTargetStaffRole(null);
    setActiveRole('customer');
    setPin('');
    setErrorMsg('');
    setSuccessMsg('');
    window.dispatchEvent(new CustomEvent('bmb:staff-login-dismissed'));
  };

  const chooseRole = (role: StaffRole) => {
    setSelectedRole(role);
    setTargetStaffRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    setPin('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!isSupabaseConfigured) {
      setErrorMsg('Staff authentication is unavailable because Supabase is not configured.');
      return;
    }
    const cleanPin = pin.trim();
    if (!/^\d{4,8}$/.test(cleanPin)) {
      setErrorMsg('Enter your 4–8 digit staff PIN.');
      return;
    }

    setBusy(true);
    try {
      const session = await signInWithStaffPin(selectedRole, cleanPin);
      if (session.role !== selectedRole) throw new Error('Invalid credentials.');
      setActiveRole(selectedRole);
      setSuccessMsg('Login successful.');
      window.dispatchEvent(new CustomEvent('bmb:staff-authenticated', {
        detail: { role: selectedRole, userId: session.id }
      }));
      setIsStaffLoginOpen(false);
      setTargetStaffRole(null);
      setPin('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  const roleMeta: Record<StaffRole, { title: string; description: string; icon: React.ReactNode }> = {
    admin: { title: 'Admin', description: 'Administration and order controls', icon: <ShieldAlert className="w-5 h-5" /> },
    manager: { title: 'Manager', description: 'Kitchen, menu and dispatch operations', icon: <Briefcase className="w-5 h-5" /> },
    chef: { title: 'Chef', description: 'Production and kitchen operations', icon: <ChefHat className="w-5 h-5" /> }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-sm shadow-2xl border-2 border-[#124E33] overflow-hidden">
        <div className="bg-[#0C3822] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C94C] text-black flex items-center justify-center"><Lock className="w-5 h-5" /></div>
            <div><h2 className="text-lg font-bold text-[#F2C94C]">Staff Login</h2><p className="text-xs text-emerald-200">Choose role → enter PIN</p></div>
          </div>
          <button type="button" aria-label="Close staff login" onClick={closeLogin} className="p-2 rounded-xl text-emerald-300 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-200">
          {(['admin', 'manager', 'chef'] as StaffRole[]).map(role => (
            <button key={role} type="button" onClick={() => chooseRole(role)} className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 ${selectedRole === role ? 'bg-[#124E33] text-white border-[#124E33]' : 'bg-white text-gray-700 border-gray-300'}`}>
              {roleMeta[role].icon}<span>{roleMeta[role].title}</span>
            </button>
          ))}
        </div>
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          <div className="p-3.5 bg-white rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900">{roleMeta[selectedRole].icon}{roleMeta[selectedRole].title}</div>
            <p className="text-xs text-gray-600 mt-1">{roleMeta[selectedRole].description}</p>
          </div>
          <label className="block text-xs font-bold text-gray-700">
            Staff PIN
            <input className="w-full mt-1.5 px-4 py-4 bg-white border border-gray-300 rounded-xl text-center text-2xl tracking-[0.45em] font-mono outline-none focus:ring-2 focus:ring-[#124E33]" type="password" inputMode="numeric" pattern="[0-9]*" maxLength={8} autoComplete="current-password" placeholder="••••" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))} autoFocus />
          </label>
          {errorMsg && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{errorMsg}</div>}
          {successMsg && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{successMsg}</div>}
          <button disabled={busy} type="submit" className="w-full py-3.5 bg-[#124E33] disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F2C94C]" /><span>{busy ? 'Signing in…' : `Enter ${roleMeta[selectedRole].title}`}</span><ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-gray-400 text-center">PIN is verified server-side. No staff email is shown or entered here.</p>
        </form>
      </div>
    </div>
  );
};
