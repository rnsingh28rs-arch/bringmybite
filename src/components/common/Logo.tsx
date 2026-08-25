import React from 'react';
import { useCms } from '../../cms/CmsContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
}) => {
  const cms = useCms();

  const isLight = variant === 'light';

  // Logo uploaded in /public
  const logoSrc =
    cms.siteSettings.logo_url || '/bringmybite_logo.PNG';

  const imageSize =
    size === 'sm'
      ? 'h-12 max-w-44'
      : size === 'lg'
        ? 'h-24 max-w-72'
        : 'h-20 max-w-60';

  const titleSize =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
        ? 'text-3xl'
        : 'text-2xl';

  const taglineSize =
    size === 'sm'
      ? 'text-[8px]'
      : size === 'lg'
        ? 'text-[11px]'
        : 'text-[10px]';

  return (
    <div
      className="
        group
        flex
        items-center
        gap-3
        select-none
        cursor-pointer
      "
    >
      {/* Main BringMyBite Logo */}
      <div
        className="
          flex
          items-center
          justify-center
          shrink-0
          transition-all
          duration-300
          ease-out
          group-hover:scale-105
          group-hover:-translate-y-0.5
        "
      >
        <img
          src={logoSrc}
          alt={
            cms.siteSettings.business_name ||
            'Bring My Bite'
          }
          className={`
            ${imageSize}
            w-auto
            object-contain
            transition-all
            duration-300
            ease-out
            group-hover:drop-shadow-[0_6px_14px_rgba(0,0,0,0.22)]
          `}
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center leading-tight">

        <div
          className={`
            ${titleSize}
            font-extrabold
            tracking-tight
            transition-all
            duration-300
            group-hover:tracking-normal
            ${
              isLight
                ? 'text-white'
                : 'text-[#124E33]'
            }
          `}
        >
          BringMyBite
        </div>

        {/* By Shree Foods */}
        <div
          className={`
            ${taglineSize}
            mt-1
            font-semibold
            tracking-[0.18em]
            uppercase
            ${
              isLight
                ? 'text-white/80'
                : 'text-[#124E33]'
            }
          `}
        >
          By Shree Foods
        </div>

        {/* Tagline */}
        <div
          className={`
            ${taglineSize}
            mt-0.5
            font-medium
            tracking-wide
            ${
              isLight
                ? 'text-white/70'
                : 'text-gray-500'
            }
          `}
        >
          Your Health Is Our Concern
        </div>

      </div>
    </div>
  );
};

export default Logo;
