import React, { useState } from 'react';
import { Logo } from './Logo';
import { useApp } from '../../context/AppContext';
import { Menu, X, Zap, CalendarCheck, Lock } from 'lucide-react';

interface HeaderProps { onNavigateSection?: (sectionId: string) => void; }

export const Header: React.FC<HeaderProps> = ({ onNavigateSection }) => {
  const { setActiveRole, setIsRegistrationOpen, setIsInstantOrderOpen, setIsWeeklyMenuOpen } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (sectionId === 'menu') { setIsWeeklyMenuOpen(true); return; }
    if (sectionId === 'instant') { setIsInstantOrderOpen(true); return; }
    if (sectionId === 'subscribe') { setIsRegistrationOpen(true); return; }
    if (onNavigateSection) onNavigateSection(sectionId); else document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };
  return <header className="sticky top-0 z-40 w-full max-w-full overflow-x-clip bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] shadow-xs">
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="hidden md:flex items-center justify-between h-20 min-w-0">
        <div className="cursor-pointer min-w-0 shrink" onClick={() => { setActiveRole('customer'); window.scrollTo({top:0,behavior:'smooth'}); }}><Logo size="md" /></div>
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-[#1A261E] shrink-0">
          <button onClick={()=>handleNavClick('hero')} className="text-[#124E33] py-1">Home</button><button onClick={()=>handleNavClick('today-menu')} className="text-gray-700 py-1">Today's Menu</button><button onClick={()=>handleNavClick('packages')} className="text-gray-700 py-1">Our Packages</button><button onClick={()=>handleNavClick('delivery-model')} className="text-gray-700 py-1">How It Works</button><button onClick={()=>handleNavClick('why-us')} className="text-gray-700 py-1">About Us</button><button onClick={()=>handleNavClick('contact')} className="text-gray-700 py-1">Contact Us</button>
        </nav>
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <button onClick={()=>setIsInstantOrderOpen(true)} className="flex items-center gap-1.5 text-xs font-bold px-3 lg:px-4 py-2.5 rounded-xl border border-[#C88A24] text-[#8C5E13] bg-[#FDF7E7]"><Zap className="w-4 h-4 text-[#C88A24] fill-[#C88A24]"/><span>Instant Thali</span></button>
          <button onClick={()=>setIsRegistrationOpen(true)} className="hidden lg:flex items-center gap-2 bg-[#124E33] text-white text-xs font-bold px-4.5 py-2.5 rounded-xl"><CalendarCheck className="w-4 h-4 text-[#F2C94C]"/><span>Subscribe Now</span></button>
        </div>
      </div>
      <div className="flex md:hidden items-center gap-1.5 h-[76px] min-w-0">
        <div className="min-w-0 flex-1 overflow-hidden cursor-pointer" onClick={()=>{setActiveRole('customer');window.scrollTo({top:0,behavior:'smooth'});}}><Logo size="sm"/></div>
        <div className="flex items-center gap-1.5 shrink-0"><button onClick={()=>setIsInstantOrderOpen(true)} className="shrink-0 text-[10px] bg-[#FDF7E7] text-[#8C5E13] border border-[#C88A24] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1"><Zap className="w-3 h-3 text-[#C88A24] fill-[#C88A24]"/><span>Instant</span></button><button onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} className="shrink-0 p-1.5 rounded-xl text-gray-700" aria-label="Toggle Navigation Menu">{mobileMenuOpen?<X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}</button></div>
      </div>
    </div>
    {mobileMenuOpen && <div className="md:hidden bg-[#FAF7F2] border-b border-[#E8E1D5] px-4 pt-3 pb-6 space-y-4 shadow-lg">
      <div className="flex flex-col space-y-2.5 font-medium text-sm text-gray-800"><button onClick={()=>handleNavClick('hero')} className="text-left px-2 py-1.5">Home</button><button onClick={()=>handleNavClick('today-menu')} className="text-left px-2 py-1.5">Today's Menu</button><button onClick={()=>handleNavClick('packages')} className="text-left px-2 py-1.5">Subscription Packages</button><button onClick={()=>handleNavClick('delivery-model')} className="text-left px-2 py-1.5">Delivery to College & Office Gate</button><button onClick={()=>handleNavClick('why-us')} className="text-left px-2 py-1.5">About Shree Foods</button><button onClick={()=>handleNavClick('contact')} className="text-left px-2 py-1.5">Contact Us</button></div>
      <div className="pt-3 border-t border-gray-200 space-y-2.5"><button onClick={()=>{setMobileMenuOpen(false);setIsInstantOrderOpen(true);}} className="w-full bg-[#FDF7E7] text-[#8C5E13] border-2 border-[#C88A24] py-2.5 rounded-xl font-extrabold text-xs"><Zap className="inline w-4 h-4"/> Order Instant Thali</button><button onClick={()=>{setMobileMenuOpen(false);setIsRegistrationOpen(true);}} className="w-full bg-[#124E33] text-white py-3 rounded-xl font-bold text-sm"><CalendarCheck className="inline w-4 h-4"/> Subscribe Monthly Plan</button><div className="pt-2 text-center"><button onClick={()=>{setMobileMenuOpen(false);window.location.assign('/admin#115566');}} className="text-[11px] text-gray-500 flex items-center justify-center gap-1 mx-auto"><Lock className="w-3 h-3"/><span>Staff Portal</span></button></div></div>
    </div>}
  </header>;
};
