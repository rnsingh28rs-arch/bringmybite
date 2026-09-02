import React from 'react';
import { AlertCircle } from 'lucide-react';
import { isTemporaryNoticeActive, NOTICE_TEXT } from '../../utils/temporaryNotice.mjs';

export const TemporaryNoticeTicker: React.FC = () => {
  if (!isTemporaryNoticeActive()) return null;

  return (
    <div className="bg-red-700 text-white overflow-hidden border-b-2 border-red-900 shadow-sm" role="status" aria-live="polite">
      <div className="max-w-7xl mx-auto min-h-[42px] flex items-center overflow-hidden">
        <div className="shrink-0 bg-red-900 px-3 py-2 text-[10px] sm:text-xs font-black tracking-widest uppercase flex items-center gap-1.5 z-10 shadow-md">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Important Notice</span>
        </div>
        <div className="overflow-hidden flex-1 whitespace-nowrap min-w-0">
          <div className="inline-flex items-center gap-8 pl-5 pr-5 animate-marquee font-bold text-xs sm:text-sm">
            <span>{NOTICE_TEXT}</span>
            <span aria-hidden="true">•</span>
            <span>{NOTICE_TEXT}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
