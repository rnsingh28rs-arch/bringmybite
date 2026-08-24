import React from 'react';
import { useApp } from '../../context/AppContext';
import { STAFF_CREDENTIALS } from '../../data/staffConfig';
import {
  ShieldAlert,
  Briefcase,
  ChefHat,
  LogOut,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const StaffNavBar: React.FC = () => {
  const { activeRole, setActiveRole, openStaffLogin } = useApp();

  if (activeRole === 'customer') return null;

  const currentConfig = STAFF_CREDENTIALS[activeRole as 'admin' | 'manager' | 'chef'] || STAFF_CREDENTIALS.admin;

  return (
    <div className="bg-[#05180F] text-white border-b-2 border-amber-400 py-2.5 px-4 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Role Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-bold text-xs shadow-xs">
            {activeRole === 'admin' && <ShieldAlert className="w-5 h-5 text-red-900" />}
            {activeRole === 'manager' && <Briefcase className="w-5 h-5 text-blue-900" />}
            {activeRole === 'chef' && <ChefHat className="w-5 h-5 text-amber-900" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                Staff Control Zone
              </span>
              <span className="bg-emerald-800 text-emerald-100 text-[10px] px-2 py-0.2 rounded-full font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Session
              </span>
            </div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>{currentConfig.title}</span>
              <span className="text-gray-400 text-[11px]">({currentConfig.name})</span>
            </div>
          </div>
        </div>

        {/* Middle: Fast Switch between Staff Panels */}
        <div className="flex items-center bg-black/50 p-1 rounded-xl border border-emerald-900/80 gap-1 text-xs">
          <button
            onClick={() => setActiveRole('admin')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeRole === 'admin'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => setActiveRole('manager')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeRole === 'manager'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Manager</span>
          </button>

          <button
            onClick={() => setActiveRole('chef')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeRole === 'chef'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Chef</span>
          </button>
        </div>

        {/* Right: Exit to Customer Site button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveRole('customer')}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-4 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit to Customer Website</span>
          </button>
        </div>

      </div>
    </div>
  );
};
