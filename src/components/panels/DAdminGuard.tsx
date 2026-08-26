import React, { useEffect, useState } from 'react';
import { getCurrentUser, signInWithStaffPin, signOut, supabaseRpc } from '../../cms/supabaseRest';
import { ShieldCheck, Lock, X } from 'lucide-react';

type AdminAccount = { user_id:string; email:string; role_id:string; active:boolean };
const isDAdminRole=(roleId?:string)=>roleId==='d_admin'||roleId==='ceo-director';

export const DAdminGuard:React.FC<{children:React.ReactNode}>=({children})=>{
  const [ready,setReady]=useState(false);
  const [authorized,setAuthorized]=useState(false);
  const [pin,setPin]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);

  useEffect(()=>{
    let cancelled=false;
    const restore=async()=>{
      try{
        const auth=await getCurrentUser();
        if(auth?.id){
          const rows=await supabaseRpc<AdminAccount>('bmb_get_staff_account');
          const account=rows[0];
          if(!cancelled&&account?.active&&isDAdminRole(account.role_id)) setAuthorized(true);
          else if(!cancelled) signOut();
        }
      }catch{if(!cancelled)setAuthorized(false);}finally{if(!cancelled)setReady(true);}
    };
    void restore();return()=>{cancelled=true;};
  },[]);

  const close=()=>{setPin('');setError('');signOut();window.location.assign('/');};
  const login=async(e:React.FormEvent)=>{
    e.preventDefault();setBusy(true);setError('');
    try{
      const session=await signInWithStaffPin('d_admin',pin.trim());
      if(session.role!=='d_admin') throw new Error('This account is not authorized for D-Admin.');
      const rows=await supabaseRpc<AdminAccount>('bmb_get_staff_account');
      const account=rows[0];
      if(!account?.active||!isDAdminRole(account.role_id)) throw new Error('This account is not authorized for D-Admin.');
      setAuthorized(true);setPin('');
    }catch(err){setAuthorized(false);setError(err instanceof Error?err.message:'Login failed.');}
    finally{setBusy(false);}
  };

  if(!ready)return <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC]"><div className="font-bold text-[#124E33]">Checking secure D-Admin session…</div></div>;
  if(authorized)return <>{children}</>;
  return <div className="min-h-screen bg-[#F6F3EC] flex items-center justify-center p-5"><form onSubmit={login} className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-xl p-7 space-y-4"><div className="flex items-center justify-between"><div className="w-12 h-12 rounded-2xl bg-[#0C3822] text-[#F2C94C] flex items-center justify-center"><Lock className="w-6 h-6"/></div><button type="button" aria-label="Close D-Admin login" onClick={close} className="p-2 rounded-xl text-gray-400 hover:text-gray-700"><X className="w-5 h-5"/></button></div><div><div className="text-[10px] uppercase tracking-[0.22em] text-amber-600 font-black">D-ADMIN</div><h1 className="text-2xl font-black text-[#124E33] mt-1">Director Login</h1><p className="text-sm text-gray-500 mt-1">Enter the D-Admin PIN.</p></div><input className="w-full rounded-xl border border-gray-200 bg-white px-4 py-4 text-center text-2xl tracking-[0.45em] font-mono outline-none focus:ring-2 focus:ring-emerald-500" type="password" inputMode="numeric" pattern="[0-9]*" maxLength={8} autoComplete="current-password" placeholder="••••" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,8))} autoFocus/>{error&&<div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">{error}</div>}<button disabled={busy} className="w-full py-3 rounded-xl bg-[#124E33] disabled:opacity-60 text-white font-black flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4 text-[#F2C94C]"/>{busy?'Checking…':'Enter D-Admin'}</button></form></div>;
};
