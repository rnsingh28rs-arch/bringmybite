import React, { useEffect, useState } from 'react';
import { Download, Smartphone, Share, X, CheckCircle2 } from 'lucide-react';
import { getInstallPlatform, isStandaloneMode } from '../../utils/pwaInstall.js';

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

export const InstallAppButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const checkInstalled = () => setInstalled(window.matchMedia('(display-mode: standalone)').matches || isStandaloneMode(navigator));
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as InstallPromptEvent);
    };
    checkInstalled();
    window.addEventListener('beforeinstallprompt', capturePrompt);
    window.addEventListener('appinstalled', checkInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('appinstalled', checkInstalled);
    };
  }, []);

  const platform = getInstallPlatform(navigator.userAgent);

  const install = async () => {
    if (installed) return;
    if (platform === 'ios') {
      setShowIosHelp(true);
      return;
    }
    if (!deferredPrompt) {
      setShowIosHelp(true);
      return;
    }
    setBusy(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={install}
        disabled={busy}
        aria-label={installed ? 'Bring My Bite is installed' : 'Install Bring My Bite app'}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#C88A24] bg-[#FDF7E7] text-[#8C5E13] hover:bg-[#F9EDCF] text-xs font-extrabold shadow-xs active:scale-95 transition-all disabled:opacity-60"
      >
        {installed ? <CheckCircle2 className="w-4 h-4 text-[#124E33]" /> : <Download className="w-4 h-4 text-[#C88A24]" />}
        <span>{installed ? 'App Installed' : busy ? 'Installing…' : 'Install App'}</span>
      </button>

      {showIosHelp && !installed && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3" onClick={() => setShowIosHelp(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-[#FAF7F2] border-2 border-[#C88A24] p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-2xl overflow-hidden bg-white border border-[#E8E1D5]"><img src="/icons/icon-192.png" alt="Bring My Bite" className="w-full h-full object-cover" /></div><div><h3 className="font-extrabold text-[#124E33]">Install Bring My Bite</h3><p className="text-[11px] text-gray-500">{platform === 'ios' ? 'iPhone / iPad' : 'Installation'}</p></div></div>
              <button type="button" onClick={() => setShowIosHelp(false)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            {platform === 'ios' ? (
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex gap-3 items-start"><Share className="w-5 h-5 shrink-0 text-[#124E33] mt-0.5" /><p>Tap <b>Share</b> in Safari, then choose <b>Add to Home Screen</b>.</p></div>
                <p className="text-xs text-gray-500">After adding it, the Bring My Bite icon will appear on your iPhone and open as an app.</p>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex gap-3 items-start"><Smartphone className="w-5 h-5 shrink-0 text-[#124E33] mt-0.5" /><p>Open this website in a supported Android browser and tap <b>Install</b> when the browser asks.</p></div>
                <p className="text-xs text-gray-500">If no install prompt appears yet, use the browser menu and choose <b>Install app</b> or <b>Add to Home screen</b>.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
