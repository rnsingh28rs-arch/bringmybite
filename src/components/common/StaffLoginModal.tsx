import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { isSupabaseConfigured, signIn, signOut, supabaseRpc } from '../../cms/supabaseRest';
import { ShieldAlert, Briefcase, ChefHat, Lock, X, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

type StaffRole = 'admin' | 'manager' | 'chef';
type AdminAccount = { user_id: string; email: string; role_id: StaffRole; active: boolean };

export const StaffLoginModal: React.FC = () => {
  const { isStaffLoginOpen, setIsStaffLoginOpen, targetStaffRole, setTargetStaffRole, setActiveRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<StaffRole>(targetStaffRole || 'admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (targetStaffRole) setSelectedRole(targetStaffRole);
    setErrorMsg('');
  }, [targetStaffRole, isStaffLoginOpen]);

  if (!isStaffLoginOpen) return null;

  const closeLogin = () => {
    setIsStaffLoginOpen(false);
    setTargetStaffRole(null);
    setActiveRole('customer');
    setPassword('');
    setErrorMsg('');
    setSuccessMsg('');
    window.dispatchEvent(new CustomEvent('bmb:staff-login-dismissed'));
  };

  const chooseRole = (role: StaffRole) => {
    setSelectedRole(role);
    setTargetStaffRole(role);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isSupabaseConfigured) {
      setErrorMsg('Staff authentication is unavailable because Supabase is not configured.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMsg('Enter the staff email and password.');
      return;
    }

    setBusy(true);
    try {
      await signIn(email.trim(), password);
      const rows = await supabaseRpc<AdminAccount>('bmb_get_staff_account');
      const account = rows[0];

      if (!account) {
        await signOut();
        throw new Error('This account is not registered as an active staff account.');
      }
      if (!account.active) {
        await signOut();
        throw new Error('This staff account is inactive. Contact an administrator.');
      }
      if (account.role_id !== selectedRole) {
        await signOut();
        throw new Error(`This account is assigned to the ${account.role_id} role, not ${selectedRole}.`);
      }

      setActiveRole(selectedRole);
      window.dispatchEvent(new CustomEvent('bmb:staff-authenticated', {
        detail: { role: selectedRole, userId: account.user_id, email: account.email }
      }));
      setSuccessMsg('Access granted.');

      window.setTimeout(() => {
        setIsStaffLoginOpen(false);
        setTargetStaffRole(null);
        setPassword('');
        setSuccessMsg('');
      }, 350);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  const roleMeta: Record<StaffRole, { title: string; description: string; icon: React.ReactNode }> = {
    admin: { title: 'Master Administrator', description: 'Executive administration and audit controls', icon: <ShieldAlert className="w-5 h-5" /> },
    manager: { title: 'Operations Manager', description: 'Kitchen, menu and dispatch operations', icon: <Briefcase className="w-5 h-5" /> },
    chef: { title: 'Head Kitchen Chef', description: 'Production, batches and kitchen operations', icon: <ChefHat className="w-5 h-5" /> }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-lg shadow-2xl border-2 border-[#124E33] overflow-hidden">
        <div className="bg-[#0C3822] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C94C] text-black flex items-center justify-center"><Lock className="w-5 h-5" /></div>
            <div><h2 className="text-lg font-bold text-[#F2C94C]">Staff Authentication</h2><p className="text-xs text-emerald-200">Supabase-authenticated staff only</p></div>
          </div>
          <button type="button" aria-label="Close staff authentication" onClick={closeLogin} className="p-2 rounded-xl text-emerald-300 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 border-b border-gray-200 grid grid-cols-3 gap-2">
          {(['admin', 'manager', 'chef'] as StaffRole[]).map(role => (
            <button key={role} type="button" onClick={() => chooseRole(role)} className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 ${selectedRole === role ? 'bg-[#124E33] text-white border-[#124E33]' : 'bg-white text-gray-700 border-gray-300'}`}>
              {roleMeta[role].icon}<span>{role === 'admin' ? 'Admin' : role === 'manager' ? 'Manager' : 'Chef'}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="p-5 space-y-4">
          <div className="p-3.5 bg-white rounded-2xl border border-gray-200"><div className="flex items-center gap-2 font-bold text-sm text-gray-900">{roleMeta[selectedRole].icon}{roleMeta[selectedRole].title}</div><p className="text-xs text-gray-600 mt-1">{roleMeta[selectedRole].description}</p></div>
          <label className="block text-xs font-bold text-gray-700">Staff Email<input className="w-full mt-1.5 px-3 py-3 bg-white border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#124E33]" type="email" autoComplete="username" placeholder="staff@example.com" value={email} onChange={e => setEmail(e.target.value)} /></label>
          <label className="block text-xs font-bold text-gray-700">Password<input className="w-full mt-1.5 px-3 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-[#124E33]" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} /></label>
          <button type="button" onClick={() => setShowPassword(v => !v)} className="text-xs text-gray-500 flex items-center gap-1">{showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{showPassword ? 'Hide password' : 'Show password'}</button>
          {errorMsg && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{errorMsg}</div>}
          {successMsg && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{successMsg}</div>}
          <button disabled={busy} type="submit" className="w-full py-3.5 bg-[#124E33] disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4 text-[#F2C94C]" /><span>{busy ? 'Authenticating…' : `Unlock ${roleMeta[selectedRole].title}`}</span><ArrowRight className="w-4 h-4" /></button>
          <p className="text-[11px] text-gray-400 text-center">No master PIN, role name, or default password is accepted in the browser.</p>
        </form>
      </div>
    </div>
  );
};
