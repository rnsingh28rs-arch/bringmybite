import React, { useState } from 'react';
import { Logo } from './Logo';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  X,
  Zap,
  CalendarCheck,
  Lock
} from 'lucide-react';

interface HeaderProps {
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateSection }) => {
  const {
    setActiveRole,
    setIsRegistrationOpen,
    setIsInstantOrderOpen,
    setIsWeeklyMenuOpen,
    openStaffLogin
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (sectionId === 'menu') {
      setIsWeeklyMenuOpen(true);
      return;
    }
    if (sectionId === 'instant') {
      setIsInstantOrderOpen(true);
      return;
    }
    if (sectionId === 'subscribe') {
      setIsRegistrationOpen(true);
      return;
    }
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo: BRING MY BiTE by Shree Foods */}
          <div
            className="cursor-pointer"
            onClick={() => {
              setActiveRole('customer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-[#1A261E]">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-[#124E33] hover:text-[#0C3822] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#124E33] cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('today-menu')}
              className="text-gray-700 hover:text-[#124E33] transition-colors py-1 cursor-pointer"
            >
              Today's Menu
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className="text-gray-700 hover:text-[#124E33] transition-colors py-1 cursor-pointer"
            >
              Our Packages
            </button>
            <button
              onClick={() => handleNavClick('delivery-model')}
              className="text-gray-700 hover:text-[#124E33] transition-colors py-1 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('why-us')}
              className="text-gray-700 hover:text-[#124E33] transition-colors py-1 cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-gray-700 hover:text-[#124E33] transition-colors py-1 cursor-pointer"
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action CTAs: Instant Thali & Subscribe Now */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Instant Order Button */}
            <button
              onClick={() => setIsInstantOrderOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border border-[#C88A24] text-[#8C5E13] bg-[#FDF7E7] hover:bg-[#F9EDCF] transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-[#C88A24] fill-[#C88A24]" />
              <span>Instant Thali</span>
            </button>

            {/* Subscribe Now CTA */}
            <button
              onClick={() => setIsRegistrationOpen(true)}
              className="flex items-center gap-2 bg-[#124E33] hover:bg-[#0A2A1B] text-white text-xs font-bold px-4.5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-[#F2C94C]" />
              <span>Subscribe Now</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsInstantOrderOpen(true)}
              className="text-xs bg-[#FDF7E7] text-[#8C5E13] border border-[#C88A24] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-[#C88A24] fill-[#C88A24]" />
              <span>Instant Thali</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#E8E1D5] px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2.5 font-medium text-sm text-gray-800">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-left px-2 py-1.5 hover:text-[#124E33] font-semibold"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('today-menu')}
              className="text-left px-2 py-1.5 hover:text-[#124E33]"
            >
              Today's Menu
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className="text-left px-2 py-1.5 hover:text-[#124E33]"
            >
              Subscription Packages (₹3,500 - ₹4,500)
            </button>
            <button
              onClick={() => handleNavClick('delivery-model')}
              className="text-left px-2 py-1.5 hover:text-[#124E33]"
            >
              Delivery to College & Office Gate
            </button>
            <button
              onClick={() => handleNavClick('why-us')}
              className="text-left px-2 py-1.5 hover:text-[#124E33]"
            >
              About Shree Foods
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-2 py-1.5 hover:text-[#124E33]"
            >
              Contact Us (9004848984)
            </button>
          </div>

          <div className="pt-3 border-t border-gray-200 space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsInstantOrderOpen(true);
              }}
              className="w-full bg-[#FDF7E7] text-[#8C5E13] border-2 border-[#C88A24] py-2.5 rounded-xl font-extrabold text-xs shadow-2xs flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#C88A24] fill-[#C88A24]" />
              <span>⚡ Order Instant Thali</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsRegistrationOpen(true);
              }}
              className="w-full bg-[#124E33] text-white py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-[#F2C94C]" />
              <span>Subscribe Monthly Plan</span>
            </button>

            {/* Discreet Staff Portal Button */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openStaffLogin('admin');
                }}
                className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto"
              >
                <Lock className="w-3 h-3" />
                <span>Authorized Staff Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
