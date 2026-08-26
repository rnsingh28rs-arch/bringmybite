import React from 'react';
import { useApp } from '../../context/AppContext';
import { STAFF_CREDENTIALS } from '../../data/staffConfig';
import { ShieldAlert, Briefcase, ChefHat, LogOut, Sparkles } from 'lucide-react';

export const StaffNavBar: React.FC = () => {
  const { activeRole, setActiveRole } = useApp();
  if (activeRole === 'customer') return null;

  const currentConfig = STAFF_CREDENTIALS[activeRole as 'admin' | 'manager' | 'chef'] || STAFF_CREDENTIALS.admin;

  const go = (path: string, role: 'admin' | 'manager' | 'chef') => {
    setActiveRole(role);
    window.location.assign(path);
  };

  return (
    <div className="bg-[#05180F] text-white border-b-2 border-amber-400 py-2.5 px-4 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-xs">
            {activeRole === 'admin' && <ShieldAlert className="w-5 h-5 text-red-900" />}
            {activeRole === 'manager' && <Briefcase className="w-5 h-5 text-blue-900" />}
            {activeRole === 'chef' && <ChefHat className="w-5 h-5 text-amber-900" />}
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">Staff Control Zone</div>
            <div className="text-xs font-bold text-white">{currentConfig.title}</div>
          </div>
        </div>

        <div className="flex items-center bg-black/50 p-1 rounded-xl border border-emerald-900/80 gap-1 text-xs">
          <button type="button" onClick={() => go('/admin', 'admin')} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${activeRole === 'admin' ? 'bg-red-700 text-white' : 'text-gray-300 hover:text-white'}`}><ShieldAlert className="w-3.5 h-3.5" />Admin</button>
          <button type="button" onClick={() => go('/manager', 'manager')} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${activeRole === 'manager' ? 'bg-blue-700 text-white' : 'text-gray-300 hover:text-white'}`}><Briefcase className="w-3.5 h-3.5" />Manager</button>
          <button type="button" onClick={() => go('/chef', 'chef')} className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${activeRole === 'chef' ? 'bg-amber-700 text-white' : 'text-gray-300 hover:text-white'}`}><ChefHat className="w-3.5 h-3.5" />Chef</button>
          <button type="button" onClick={() => window.location.assign('/d-admin')} className="px-3 py-1.5 rounded-lg font-bold text-amber-300 hover:text-white hover:bg-amber-500/20 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" />D-Admin</button>
        </div>

        <button type="button" onClick={() => { setActiveRole('customer'); window.location.assign('/'); }} className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-4 py-1.5 rounded-xl font-bold text-xs shadow-md">
          <LogOut className="w-3.5 h-3.5" />Exit to Website
        </button>
      </div>
    </div>
  );
};
