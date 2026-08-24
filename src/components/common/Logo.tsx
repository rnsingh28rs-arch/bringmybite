import React from 'react';
import { Utensils, Leaf } from 'lucide-react';
import { useCms } from '../../cms/CmsContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark' }) => {
  const cms = useCms();
  const isLight = variant === 'light';

  return (
    <div className="flex items-center gap-2.5 select-none">
      {cms.siteSettings.logo_url ? (
        <img src={cms.siteSettings.logo_url} alt={cms.siteSettings.business_name || 'Bring My Bite'} className={`${size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11'} rounded-full object-cover border border-[#C88A24]/30 shadow-sm`} />
      ) : null}
      {/* Icon Emblem */}
      <div className={`relative flex items-center justify-center rounded-full transition-transform hover:scale-105 ${
        size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11'
      } ${
        isLight ? 'bg-[#FAF7F2] text-[#124E33]' : 'bg-[#124E33] text-[#D99B26]'
      } shadow-sm border border-[#C88A24]/30`}>
        <div className="relative">
          <Utensils className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5'} stroke-[2.2]`} />
          <Leaf className={`absolute -top-1.5 -right-1.5 ${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-[#16a34a] fill-[#16a34a]`} />
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className={`font-extrabold tracking-tight ${
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
          } ${isLight ? 'text-white' : 'text-[#0E3824]'}`}>
            {(cms.siteSettings.business_name || 'BRING MY').toUpperCase()}
          </span>
          <span className={`font-black tracking-wider text-[#C88A24] ${
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
          }`}>
            BiTE
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 -mt-0.5">
          <span className={`text-[9px] font-semibold tracking-widest uppercase ${
            isLight ? 'text-emerald-200' : 'text-[#124E33]'
          }`}>
            {cms.siteSettings.tagline || 'Homely Tiffin Service'}
          </span>
          <span className="text-[9px] text-[#C88A24]">•</span>
          <span className={`text-[8px] font-medium tracking-tight ${
            isLight ? 'text-gray-300' : 'text-gray-500'
          }`}>
            by {cms.siteSettings.legal_name || 'SHREE FOODS'}
          </span>
        </div>
      </div>
    </div>
  );
};
