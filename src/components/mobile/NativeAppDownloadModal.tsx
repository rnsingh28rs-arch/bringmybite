import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateAndDownloadZip } from '../../utils/zipExporter';
import {
  X,
  Smartphone,
  Download,
  Terminal,
  Layers,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Globe,
  Bell,
  Navigation,
  QrCode,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const NativeAppDownloadModal: React.FC = () => {
  const {
    isNativeAppModalOpen,
    setIsNativeAppModalOpen,
    deviceType,
    setDeviceType
  } = useApp();

  const [activePlatformTab, setActivePlatformTab] = useState<'android' | 'ios' | 'pwa' | 'code' | 'zips'>('zips');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  if (!isNativeAppModalOpen) return null;

  const handleDownloadBlob = async (url: string, filename: string) => {
    try {
      setDownloadingFile(filename);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      // Fallback
      window.location.href = url;
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const capacitorConfig = `{
  "appId": "com.shreefoods.bringmybite",
  "appName": "Bring My Bite",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#0C3822"
    },
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  }
}`;

  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.shreefoods.bringmybite">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:theme="@style/AppTheme.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const iosInfoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>Bring My Bite</string>
    <key>CFBundleIdentifier</key>
    <string>com.shreefoods.bringmybite</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>We need your location to deliver tiffin boxes accurately to your college or office gate.</string>
</dict>
</plist>`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-3xl shadow-2xl border-2 border-[#C88A24] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0C3822] text-white p-5 sm:p-6 flex items-center justify-between border-b border-emerald-900 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#C88A24] text-black flex items-center justify-center font-bold shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif-title tracking-wide text-[#F2C94C]">
                  Bring My Bite Native Mobile Apps
                </h2>
                <span className="text-[10px] bg-emerald-700 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                  iOS & Android
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Install on iPhone, Android, or build native binaries with Capacitor & PWA
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsNativeAppModalOpen(false)}
            className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-[#EFE8DC] p-2 sm:px-6 border-b border-[#DACFBC] flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActivePlatformTab('zips')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              activePlatformTab === 'zips'
                ? 'bg-[#124E33] text-white shadow-md'
                : 'text-gray-700 hover:bg-white/60'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#F2C94C]" />
            <span>📦 Download Code ZIPs</span>
          </button>

          <button
            onClick={() => setActivePlatformTab('android')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              activePlatformTab === 'android'
                ? 'bg-[#124E33] text-white shadow-md'
                : 'text-gray-700 hover:bg-white/60'
            }`}
          >
            <span>🤖 Android (APK / Google Play)</span>
          </button>

          <button
            onClick={() => setActivePlatformTab('ios')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              activePlatformTab === 'ios'
                ? 'bg-[#124E33] text-white shadow-md'
                : 'text-gray-700 hover:bg-white/60'
            }`}
          >
            <span> iOS (iPhone / iPad)</span>
          </button>

          <button
            onClick={() => setActivePlatformTab('pwa')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              activePlatformTab === 'pwa'
                ? 'bg-[#124E33] text-white shadow-md'
                : 'text-gray-700 hover:bg-white/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Instant Web App (PWA)</span>
          </button>

          <button
            onClick={() => setActivePlatformTab('code')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 ${
              activePlatformTab === 'code'
                ? 'bg-[#124E33] text-white shadow-md'
                : 'text-gray-700 hover:bg-white/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Native Project Files</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[#FAF7F2]">
          
          {/* ZIP DOWNLOADS TAB */}
          {activePlatformTab === 'zips' && (
            <div className="space-y-5">
              
              <div className="bg-[#0C3822] text-white rounded-2xl p-5 border border-emerald-800 shadow-md">
                <div className="flex items-center gap-2 text-[#F2C94C] mb-1">
                  <Download className="w-5 h-5" />
                  <h3 className="text-base font-bold font-serif-title">
                    Bifurcated Source Code & Application Packages
                  </h3>
                </div>
                <p className="text-xs text-emerald-200">
                  Download individual archives for website frontend or platform-specific mobile apps, or the complete master zip archive.
                </p>
              </div>

              {/* Master All-in-One Bifurcated Zip */}
              <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-emerald-50 rounded-2xl p-4 sm:p-5 border-2 border-[#C88A24] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-[#C88A24] text-black font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Recommended Master Bundle
                    </span>
                    <span className="text-xs text-gray-500 font-mono">14.0 MB</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mt-1 font-serif-title">
                    bring_my_bite_all_complete.zip
                  </h4>
                  <p className="text-xs text-gray-700 mt-0.5">
                    Includes bifurcated folders: <code className="font-mono bg-white/70 px-1 rounded font-bold">website/</code>, <code className="font-mono bg-white/70 px-1 rounded font-bold">application/android/</code>, and <code className="font-mono bg-white/70 px-1 rounded font-bold">application/ios/</code>.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    setDownloadingFile('all');
                    await generateAndDownloadZip('all');
                    setDownloadingFile(null);
                  }}
                  disabled={downloadingFile === 'all'}
                  className="px-4 py-2.5 bg-[#0C3822] hover:bg-[#0A2A1B] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shrink-0 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#F2C94C]" />
                  <span>{downloadingFile === 'all' ? 'Generating ZIP...' : 'Download Master Zip (All)'}</span>
                </button>
              </div>

              {/* Individual Bifurcated Zips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Website Code Zip */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-2">
                      <Globe className="w-5 h-5 text-blue-700" />
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 font-serif-title">
                      Website Source Code
                    </h4>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      website_code.zip
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Full responsive React 18, Vite, Tailwind CSS web platform with Admin, Manager, Chef, and Customer portals.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      setDownloadingFile('website');
                      await generateAndDownloadZip('website');
                      setDownloadingFile(null);
                    }}
                    disabled={downloadingFile === 'website'}
                    className="w-full py-2 bg-[#124E33] hover:bg-[#0A2A1B] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F2C94C]" />
                    <span>{downloadingFile === 'website' ? 'Generating ZIP...' : 'Download Website Zip'}</span>
                  </button>
                </div>

                {/* 2. Android Application Zip */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2">
                      <Smartphone className="w-5 h-5 text-emerald-700" />
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 font-serif-title">
                      Android Native App Code
                    </h4>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      application_android.zip
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Inside <code className="font-mono bg-gray-100 px-1 rounded text-[11px]">application/android/</code> with AndroidManifest, build.gradle, Capacitor bridge & assets.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      setDownloadingFile('android');
                      await generateAndDownloadZip('android');
                      setDownloadingFile(null);
                    }}
                    disabled={downloadingFile === 'android'}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F2C94C]" />
                    <span>{downloadingFile === 'android' ? 'Generating ZIP...' : 'Download Android Zip'}</span>
                  </button>
                </div>

                {/* 3. iOS Application Zip */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center mb-2">
                      <Sparkles className="w-5 h-5 text-[#C88A24]" />
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 font-serif-title">
                      iOS Native App Code
                    </h4>
                    <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                      application_ios.zip
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Inside <code className="font-mono bg-gray-100 px-1 rounded text-[11px]">application/ios/</code> with Info.plist, AppDelegate.swift, Podfile, Capacitor bridge & assets.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      setDownloadingFile('ios');
                      await generateAndDownloadZip('ios');
                      setDownloadingFile(null);
                    }}
                    disabled={downloadingFile === 'ios'}
                    className="w-full py-2 bg-[#C88A24] hover:bg-[#A97116] text-black text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingFile === 'ios' ? 'Generating ZIP...' : 'Download iOS Zip'}</span>
                  </button>
                </div>

              </div>

              {/* Folder Hierarchy Diagram */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2 text-xs">
                <span className="font-bold text-gray-900 block font-serif-title">
                  📁 Bifurcated Directory Structure in Master Zip:
                </span>
                <pre className="p-3 bg-gray-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`bring_my_bite_all_complete.zip
├── website/
│   ├── src/                    (React components, contexts, portals)
│   ├── public/                 (Favicon, manifest, images)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── README_WEBSITE.md
│
└── application/
    ├── android/
    │   ├── android/
    │   │   ├── app/src/main/   (AndroidManifest.xml, MainActivity.java, res/)
    │   │   ├── build.gradle
    │   │   └── settings.gradle
    │   ├── capacitor.config.json
    │   └── README_ANDROID.md
    │
    └── ios/
        ├── ios/App/            (Info.plist, AppDelegate.swift, Podfile)
        ├── capacitor.config.json
        └── README_IOS.md`}
                </pre>
              </div>

            </div>
          )}
          
          {/* ANDROID TAB */}
          {activePlatformTab === 'android' && (
            <div className="space-y-6">
              
              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Google Pay & UPI</h4>
                    <p className="text-[11px] text-gray-600">Seamless 1-tap single meal instant ordering at gate.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Van Gate Push Alerts</h4>
                    <p className="text-[11px] text-gray-600">Get notified 10 mins before the delivery van arrives.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">QR Meal Pass</h4>
                    <p className="text-[11px] text-gray-600">Instant contactless tiffin pickup verification.</p>
                  </div>
                </div>
              </div>

              {/* Build Instructions Box */}
              <div className="bg-[#0C3822] text-white rounded-2xl p-5 border border-emerald-800 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#F2C94C]" />
                    <h3 className="text-sm font-bold text-[#F2C94C] font-mono">1-Click Android Studio & APK Build</h3>
                  </div>
                  <button
                    onClick={() => handleCopy('npm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap add android\nnpx cap sync\nnpx cap open android', 'android-cli')}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] font-bold flex items-center gap-1 text-emerald-200"
                  >
                    {copiedSnippet === 'android-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'android-cli' ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>

                <div className="bg-black/50 p-3.5 rounded-xl font-mono text-xs text-emerald-300 space-y-1 overflow-x-auto border border-emerald-900">
                  <p className="text-gray-400"># 1. Install Capacitor Native Android Engine</p>
                  <p className="text-amber-300">npm install @capacitor/core @capacitor/cli @capacitor/android</p>
                  <p className="text-gray-400 mt-2"># 2. Add Android Platform & Sync Web Assets</p>
                  <p className="text-amber-300">npm run build</p>
                  <p className="text-amber-300">npx cap add android && npx cap sync</p>
                  <p className="text-gray-400 mt-2"># 3. Launch in Android Studio to generate APK / AAB</p>
                  <p className="text-emerald-400">npx cap open android</p>
                </div>
              </div>

              {/* Launch Simulator Button */}
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Test Android Experience Now</h4>
                  <p className="text-xs text-emerald-800">Launch the built-in Android Material 3 interactive simulator.</p>
                </div>
                <button
                  onClick={() => {
                    setDeviceType('android');
                    setIsNativeAppModalOpen(false);
                  }}
                  className="px-4 py-2.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <span>Open Android Simulator</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* IOS TAB */}
          {activePlatformTab === 'ios' && (
            <div className="space-y-6">
              
              {/* iOS Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#C88A24]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Dynamic Island & Live Activity</h4>
                    <p className="text-[11px] text-gray-600">Track delivery van ETA live directly from Lock Screen.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#C88A24]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Apple Pay & Face ID</h4>
                    <p className="text-[11px] text-gray-600">Instant monthly subscription renewal with biometric security.</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5 text-[#C88A24]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">College Gate GPS</h4>
                    <p className="text-[11px] text-gray-600">Accurate campus gate landmark detection with CoreLocation.</p>
                  </div>
                </div>
              </div>

              {/* Xcode Build Guide */}
              <div className="bg-[#0C3822] text-white rounded-2xl p-5 border border-emerald-800 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#F2C94C]" />
                    <h3 className="text-sm font-bold text-[#F2C94C] font-mono">1-Click Xcode & iOS IPA Build</h3>
                  </div>
                  <button
                    onClick={() => handleCopy('npm install @capacitor/core @capacitor/cli @capacitor/ios\nnpx cap add ios\nnpx cap sync\nnpx cap open ios', 'ios-cli')}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] font-bold flex items-center gap-1 text-emerald-200"
                  >
                    {copiedSnippet === 'ios-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'ios-cli' ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>

                <div className="bg-black/50 p-3.5 rounded-xl font-mono text-xs text-emerald-300 space-y-1 overflow-x-auto border border-emerald-900">
                  <p className="text-gray-400"># 1. Install Capacitor iOS Package</p>
                  <p className="text-amber-300">npm install @capacitor/core @capacitor/cli @capacitor/ios</p>
                  <p className="text-gray-400 mt-2"># 2. Build Vite Web Assets & Add iOS Container</p>
                  <p className="text-amber-300">npm run build</p>
                  <p className="text-amber-300">npx cap add ios && npx cap sync</p>
                  <p className="text-gray-400 mt-2"># 3. Launch Xcode Workspace for Simulator or App Store</p>
                  <p className="text-emerald-400">npx cap open ios</p>
                </div>
              </div>

              {/* Launch Simulator Button */}
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <div>
                  <h4 className="text-xs font-bold text-amber-950">Test iPhone Experience Now</h4>
                  <p className="text-xs text-amber-800">Launch the built-in iOS Dynamic Island interactive simulator.</p>
                </div>
                <button
                  onClick={() => {
                    setDeviceType('ios');
                    setIsNativeAppModalOpen(false);
                  }}
                  className="px-4 py-2.5 bg-[#C88A24] hover:bg-[#A97116] text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <span>Open iOS Simulator</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* PWA TAB */}
          {activePlatformTab === 'pwa' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-gray-900 font-serif-title flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#124E33]" />
                  <span>Instant Installation Without App Store (PWA)</span>
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bring My Bite is fully configured as a Progressive Web Application. You and your customers can install it directly onto any smartphone home screen in 5 seconds with zero download size:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <span className="text-xs font-extrabold text-gray-900 block"> On iPhone (Safari):</span>
                    <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1">
                      <li>Open app in <strong>Safari</strong></li>
                      <li>Tap the <strong>Share</strong> icon (bottom bar)</li>
                      <li>Scroll and tap <strong>"Add to Home Screen"</strong></li>
                      <li>App icon appears on your home screen</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    <span className="text-xs font-extrabold text-gray-900 block">🤖 On Android (Chrome):</span>
                    <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1">
                      <li>Open app in <strong>Chrome</strong></li>
                      <li>Tap the <strong>Three Dots ⋮</strong> (top right)</li>
                      <li>Tap <strong>"Install app"</strong> or "Add to Home Screen"</li>
                      <li>Instantly launches in fullscreen mode</li>
                    </ol>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* CODE TAB */}
          {activePlatformTab === 'code' && (
            <div className="space-y-4">
              
              {/* Capacitor Config */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 font-mono">capacitor.config.json</span>
                  <button
                    onClick={() => handleCopy(capacitorConfig, 'cap-json')}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    {copiedSnippet === 'cap-json' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'cap-json' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
                  {capacitorConfig}
                </pre>
              </div>

              {/* AndroidManifest */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 font-mono">android/app/src/main/AndroidManifest.xml</span>
                  <button
                    onClick={() => handleCopy(androidManifest, 'manifest-xml')}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    {copiedSnippet === 'manifest-xml' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'manifest-xml' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
                  {androidManifest}
                </pre>
              </div>

              {/* iOS Info.plist */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 font-mono">ios/App/App/Info.plist</span>
                  <button
                    onClick={() => handleCopy(iosInfoPlist, 'info-plist')}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    {copiedSnippet === 'info-plist' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSnippet === 'info-plist' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
                  {iosInfoPlist}
                </pre>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#EFE8DC] p-4 px-6 border-t border-[#DACFBC] flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-600">
            Package ID: <code className="text-emerald-900 font-mono font-bold">com.shreefoods.bringmybite</code>
          </div>

          <button
            onClick={() => setIsNativeAppModalOpen(false)}
            className="px-5 py-2 bg-[#124E33] hover:bg-[#0A2A1B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
