import React, { useState, useEffect } from 'react';

interface StaffNavBarProps {
  activeRole: 'superadmin' | 'admin' | 'manager' | 'chef';
  onExit?: () => void;
}

export const StaffNavBar: React.FC<StaffNavBarProps> = ({ activeRole, onExit }) => {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNav = (hash: string) => {
    window.location.hash = hash;
  };

  const handleExitToSite = () => {
    if (onExit) {
      onExit();
    } else {
      window.location.hash = '';
    }
  };

  return (
    <header className="bg-[#15231B] border-b border-[#243B2D] sticky top-0 z-50 px-4 py-3 shadow-xl font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Mode */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl flex items-center justify-center text-lg shadow">
            🍱
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wide">Bring My Bite Staff Suite</h1>
            <p className="text-[10px] text-emerald-400 font-bold">Kitchen & Administrative Operations</p>
          </div>
        </div>

        {/* Panel Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0F1A13] p-1 rounded-2xl border border-[#243B2D] overflow-x-auto">
          <button
            type="button"
            onClick={() => handleNav('#superadmin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeRole === 'superadmin'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A2C21]'
            }`}
          >
            <span>👑</span> D-Admin
          </button>

          <button
            type="button"
            onClick={() => handleNav('#admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeRole === 'admin'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A2C21]'
            }`}
          >
            <span>💼</span> Admin Orders
          </button>

          <button
            type="button"
            onClick={() => handleNav('#manager')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeRole === 'manager'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A2C21]'
            }`}
          >
            <span>📋</span> Manager
          </button>

          <button
            type="button"
            onClick={() => handleNav('#chef')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeRole === 'chef'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#1A2C21]'
            }`}
          >
            <span>🍳</span> Kitchen Chef
          </button>
        </div>

        {/* Exit Button */}
        <button
          type="button"
          onClick={handleExitToSite}
          className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1"
        >
          <span>Exit to Website</span>
          <span>↗</span>
        </button>

      </div>
    </header>
  );
};
