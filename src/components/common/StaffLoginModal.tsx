import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STAFF_CREDENTIALS } from '../../data/staffConfig';
import { isSupabaseConfigured, signIn, signOut, supabaseSelect } from '../../cms/supabaseRest';
import { ShieldAlert, Briefcase, ChefHat, Lock, X, CheckCircle2, AlertCircle, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

type StaffRole = 'admin' | 'manager' | 'chef';

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
    setErrorMsg(''); setSuccessMsg(''); setPassword('');
  }, [targetStaffRole, isStaffLoginOpen]);

  if (!isStaffLoginOpen) return null;
  const currentRoleConfig = STAFF_CREDENTIALS[selectedRole];

  const chooseRole = (role: StaffRole) => {
    setSelectedRole(role); setTargetStaffRole(role); setErrorMsg(''); setSuccessMsg(''); setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) { setErrorMsg('Staff authentication is unavailable until Supabase is configured.'); return; }
    if (!email.trim() || !password) { setErrorMsg('Enter your authorized staff email and password.'); return; }
    setBusy(true); setErrorMsg('');
    try {
      const auth = await signIn(email.trim(), password);
      const rows = await supabaseSelect<{ user_id: string; email: string; role_id: string; active: boolean }>('bmb_admin_users', `select=user_id,email,role_id,active&user_id=eq.${encodeURIComponent(auth.id)}&limit=1`);
      const account = rows[0];
      if (!account?.active || account.role_id !== selectedRole) {
        signOut();
        throw new Error(`This account is not authorized for the ${currentRoleConfig.title}.`);
      }
      setActiveRole(selectedRole);
      setSuccessMsg(`Access granted: ${currentRoleConfig.title}.`);
      window.setTimeout(() => { setIsStaffLoginOpen(false); setEmail(''); setPassword(''); setSuccessMsg(''); }, 350);
    } catch (err) { setErrorMsg(err instanceof Error ? err.message : 'Authentication failed.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-lg shadow-2xl border-2 border-[#124E33] overflow-hidden">
        <div className="bg-[#0C3822] text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#F2C94C] text-black flex items-center justify-center font-bold"><Lock className="w-5 h-5" /></div><div><h2 className="text-lg font-bold text-[#F2C94C]">Staff Authentication Portal</h2><p className="text-xs text-emerald-200">Restricted to authorized staff accounts</p></div></div>
          <button onClick={() => setIsStaffLoginOpen(false)} className="p-2 rounded-xl text-emerald-300 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 bg-emerald-950/20 border-b border-gray-200"><div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Select operational role:</div><div className="grid grid-cols-3 gap-2">
          {([['admin','Admin',ShieldAlert],['manager','Manager',Briefcase],['chef','Chef Kitchen',ChefHat]] as const).map(([role,label,Icon]) => <button key={role} type="button" onClick={() => chooseRole(role)} className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 ${selectedRole===role?'bg-[#124E33] text-white border-emerald-700 ring-2 ring-emerald-400':'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}><Icon className="w-4 h-4" /><span>{label}</span></button>)}
        </div></div>
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          <div className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm"><div className="text-xs font-bold text-gray-900">{currentRoleConfig.title}</div><p className="text-xs text-gray-600 mt-1">{currentRoleConfig.description}</p><p className="text-[11px] text-gray-500 mt-2">Use the email/password assigned to this role in Supabase Auth.</p></div>
          <label className="block text-xs font-bold text-gray-700">Staff Email<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} placeholder="staff@yourdomain.com" className="mt-1 w-full px-3 py-3 bg-white border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#124E33]" /></label>
          <label className="block text-xs font-bold text-gray-700">Password<div className="relative mt-1"><input type={showPassword?'text':'password'} required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" className="w-full pl-3 pr-10 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-[#124E33]" /><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-700">{showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button></div></label>
          {errorMsg && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{errorMsg}</div>}
          {successMsg && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{successMsg}</div>}
          <button type="submit" disabled={busy} className="w-full py-3.5 bg-[#124E33] disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4 text-[#F2C94C]"/><span>{busy?'Authenticating…':`Unlock ${currentRoleConfig.title}`}</span><ArrowRight className="w-4 h-4"/></button>
          <div className="text-center"><button type="button" onClick={()=>setIsStaffLoginOpen(false)} className="text-xs text-gray-500 hover:text-gray-800 underline">Return to Customer Website</button></div>
        </form>
      </div>
    </div>
  );
};
