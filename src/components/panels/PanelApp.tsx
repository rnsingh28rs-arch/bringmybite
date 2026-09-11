import React from 'react';
import { ArrowLeft, ChefHat, ClipboardList, Crown, LogOut, Settings2, ShieldCheck, UserCog } from 'lucide-react';
import { useCms } from '../../cms/CmsContext';
import { useApp } from '../../context/AppContext';
import { AdminPanel } from './AdminPanel';
import { ManagerStockPanel } from './ManagerStockPanel';
import { ChefKitchenPanel } from './ChefKitchenPanel';
import { DAdminDesigner } from './DAdminDesigner';
import { OrderRequestAlerts } from './OrderRequestAlerts';
import { StaffLoginGate } from './StaffLoginGate';
import { resolvePanelRole, PANEL_ROLES } from '../../utils/mobilePanelRouting.mjs';
import type { ActiveRole } from '../../types';

type PanelRole = Exclude<ActiveRole, 'customer'>;

const roleMeta: Record<PanelRole, { label: string; icon: React.ReactNode; description: string }> = {
  admin: { label: 'Admin', icon: <Crown className="w-5 h-5" />, description: 'Orders, customers, payments and administration' },
  manager: { label: 'Manager', icon: <ClipboardList className="w-5 h-5" />, description: 'Operations, stock and delivery workflow' },
  chef: { label: 'Chef', icon: <ChefHat className="w-5 h-5" />, description: 'Kitchen preparation and dispatch workflow' },
  d_admin: { label: 'D-Admin', icon: <Settings2 className="w-5 h-5" />, description: 'Panel, role and permission configuration' },
};

function PanelPicker({ logo }: { logo?: string }) {
  return <div className="min-h-[100dvh] bg-[#FAF7F2] flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        {logo ? <img src={logo} alt="Bring My Bite" className="mx-auto h-16 w-16 rounded-2xl object-cover border border-[#C88A24] shadow" /> : <div className="mx-auto h-16 w-16 rounded-2xl bg-[#124E33] text-[#F2C94C] flex items-center justify-center"><ShieldCheck className="w-8 h-8" /></div>}
        <h1 className="mt-4 text-2xl font-black text-[#124E33]">Bring My Bite Panel</h1>
        <p className="mt-1 text-xs text-gray-500">Select your work panel to continue.</p>
      </div>
      <div className="space-y-3">{PANEL_ROLES.map(role => <a key={role} href={`/panel-app/${role === 'd_admin' ? 'd-admin' : role}`} className="flex items-center gap-3 rounded-2xl bg-white border border-[#E5DAC6] p-4 shadow-sm active:scale-[0.99]">
        <div className="h-11 w-11 rounded-xl bg-[#124E33] text-[#F2C94C] flex items-center justify-center">{roleMeta[role].icon}</div>
        <div className="min-w-0"><div className="font-black text-[#124E33]">{roleMeta[role].label}</div><div className="text-[11px] text-gray-500">{roleMeta[role].description}</div></div>
      </a>)}</div>
      <p className="text-center text-[10px] text-gray-400 mt-5">One app • separate staff access • central orders</p>
    </div>
  </div>;
}

export const PanelApp: React.FC = () => {
  const cms = useCms();
  const { setActiveRole } = useApp();
  const role = resolvePanelRole(typeof window === 'undefined' ? '/' : window.location.pathname) as PanelRole | null;
  if (!role) return <PanelPicker logo={cms.siteSettings.logo_url} />;
  setActiveRole(role);
  const meta = roleMeta[role];
  const content = role === 'admin' ? <><OrderRequestAlerts /><AdminPanel /></> : role === 'manager' ? <ManagerStockPanel /> : role === 'chef' ? <ChefKitchenPanel /> : <DAdminDesigner />;
  return <StaffLoginGate role={role}>
    <div className="min-h-[100dvh] bg-[#FAF7F2] text-[#1A261E]">
      <header className="sticky top-0 z-50 bg-[#0C3822] text-white shadow-lg" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src={cms.siteSettings.logo_url || '/favicon.ico'} alt="Bring My Bite" className="h-10 w-10 rounded-xl object-cover bg-white" />
            <div className="min-w-0"><div className="text-[9px] uppercase tracking-widest text-emerald-200">Panel App</div><h1 className="text-base font-black truncate">{meta.label}</h1></div>
          </div>
          <a href="/panel-app" className="shrink-0 rounded-xl bg-white/10 border border-white/20 px-3 py-2 text-[10px] font-black flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Panels</a>
        </div>
      </header>
      {role === 'admin' && <div className="mx-3 mt-3 rounded-2xl bg-[#F2C94C] px-4 py-3 text-[#17231B] font-black text-sm flex items-center gap-2"><UserCog className="w-5 h-5" /> New orders stay visible until handled.</div>}
      <main className="px-2 py-3">{content}</main>
      <div className="px-4 py-4 text-center text-[10px] text-gray-400">Bring My Bite • Secure staff panel</div>
    </div>
  </StaffLoginGate>;
};
