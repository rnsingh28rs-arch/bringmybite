import JSZip from 'jszip';

// Manifest and code templates for in-browser client-side zip creation
export async function generateAndDownloadZip(type: 'all' | 'website' | 'android' | 'ios') {
  const zip = new JSZip();

  const manifestJson = {
    "name": "Bring My Bite",
    "short_name": "BringMyBite",
    "description": "Daily Mess & Single-Meal Delivery with 7-Day Revolving Menu",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0C3822",
    "theme_color": "#0C3822",
    "icons": [
      {
        "src": "/favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      }
    ]
  };

  const capacitorAndroidConfig = {
    "appId": "com.shreefoods.bringmybite",
    "appName": "Bring My Bite",
    "webDir": "dist",
    "bundledWebRuntime": false,
    "plugins": {
      "SplashScreen": {
        "launchShowDuration": 2000,
        "backgroundColor": "#0C3822"
      }
    }
  };

  const capacitorIosConfig = {
    "appId": "com.shreefoods.bringmybite",
    "appName": "Bring My Bite",
    "webDir": "dist",
    "bundledWebRuntime": false,
    "ios": {
      "contentInset": "always",
      "backgroundColor": "#0C3822"
    }
  };

  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Bring My Bite | 100% Homely Meal & Thali Service</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#FAF7F2] text-gray-900 antialiased selection:bg-[#F2C94C] selection:text-[#0C3822]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  const packageJsonContent = `{
  "name": "bring-my-bite",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "jszip": "^3.10.1",
    "lucide-react": "^1.16.0",
    "motion": "^12.40.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "recharts": "^2.15.0",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.0.0",
    "typescript": "~5.7.2",
    "vite": "^6.0.7"
  }
}`;

  const viteConfigContent = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});`;

  const readmeWebsite = `# Bring My Bite - Homely Tiffin & Mess Service

## Quick Start
1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`
Visit http://localhost:3000

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Payment Gateway & Banking Config
- Primary Bank: Axis Bank
- Account Holder: Quality Pan
- Account No: 922020048876624
- IFSC Code: UTIB0000624
- UPI ID: 9004848984@axisbank
- Policy: 100% Prepaid Only
`;

  const readmeAndroid = `# Bring My Bite - Android Application

## Build APK / Android Studio
1. Install Capacitor CLI:
\`\`\`bash
npm install -g @capacitor/cli @capacitor/android
npx cap add android
\`\`\`

2. Build and sync:
\`\`\`bash
npm run build
npx cap sync android
npx cap open android
\`\`\`
3. In Android Studio: **Build > Build Bundle(s) / APK(s) > Build APK**.
`;

  const readmeIos = `# Bring My Bite - iOS Application

## Build Xcode / iOS
1. Install Capacitor CLI:
\`\`\`bash
npm install -g @capacitor/cli @capacitor/ios
npx cap add ios
\`\`\`

2. Build and sync:
\`\`\`bash
npm run build
npx cap sync ios
npx cap open ios
\`\`\`
3. In Xcode: Select target simulator or device and click Run.
`;

  const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.shreefoods.bringmybite">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Bring My Bite"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="Bring My Bite"
            android:theme="@style/AppTheme.NoActionBarLaunch"
            android:launchMode="singleTask"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
</manifest>`;

  const mainActivityJava = `package com.shreefoods.bringmybite;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {}`;

  const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleDevelopmentRegion</key>
	<string>en</string>
	<key>CFBundleDisplayName</key>
	<string>Bring My Bite</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleName</key>
	<string>$(PRODUCT_NAME)</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0</string>
	<key>CFBundleVersion</key>
	<string>1</string>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>NSLocationWhenInUseUsageDescription</key>
	<string>Used for campus gate drop tracking and order verification.</string>
</dict>
</plist>`;

  const appDelegateSwift = `import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        return true
    }
}`;

  const bankingConfigJson = {
    "bankName": "Axis Bank",
    "primaryAccountHolder": "Quality Pan",
    "accountNumber": "922020048876624",
    "ifscCode": "UTIB0000624",
    "authorizedSignatories": "Rahul Narendra Singh",
    "accountType": "Proprietorship firm Current A/c",
    "upiId": "9004848984@axisbank",
    "prepaidOnly": true,
    "cashOnDeliveryAllowed": false
  };

  if (type === 'website' || type === 'all') {
    const webFolder = type === 'all' ? zip.folder('website')! : zip;
    webFolder.file('index.html', indexHtmlContent);
    webFolder.file('package.json', packageJsonContent);
    webFolder.file('vite.config.ts', viteConfigContent);
    webFolder.file('README.md', readmeWebsite);
    webFolder.file('PAYMENT_CONFIG.json', JSON.stringify(bankingConfigJson, null, 2));
    webFolder.file('public/manifest.json', JSON.stringify(manifestJson, null, 2));
  }

  if (type === 'android' || type === 'all') {
    const androidFolder = type === 'all' ? zip.folder('application/android')! : zip;
    androidFolder.file('README_ANDROID.md', readmeAndroid);
    androidFolder.file('package.json', packageJsonContent);
    androidFolder.file('PAYMENT_CONFIG.json', JSON.stringify(bankingConfigJson, null, 2));
    androidFolder.file('capacitor.config.json', JSON.stringify(capacitorAndroidConfig, null, 2));
    androidFolder.file('android/app/src/main/AndroidManifest.xml', androidManifestXml);
    androidFolder.file('android/app/src/main/java/com/shreefoods/bringmybite/MainActivity.java', mainActivityJava);
    androidFolder.file('android/build.gradle', `buildscript { repositories { google(); mavenCentral() } }`);
  }

  if (type === 'ios' || type === 'all') {
    const iosFolder = type === 'all' ? zip.folder('application/ios')! : zip;
    iosFolder.file('README_IOS.md', readmeIos);
    iosFolder.file('package.json', packageJsonContent);
    iosFolder.file('PAYMENT_CONFIG.json', JSON.stringify(bankingConfigJson, null, 2));
    iosFolder.file('capacitor.config.json', JSON.stringify(capacitorIosConfig, null, 2));
    iosFolder.file('ios/App/App/Info.plist', infoPlist);
    iosFolder.file('ios/App/App/AppDelegate.swift', appDelegateSwift);
    iosFolder.file('ios/App/Podfile', `platform :ios, '14.0'\nuse_frameworks!\ntarget 'App' do\n  capacitor_pods\nend`);
  }

  const filename = type === 'all' 
    ? 'bring_my_bite_all_complete.zip' 
    : type === 'website' 
    ? 'website_code.zip' 
    : type === 'android' 
    ? 'application_android.zip' 
    : 'application_ios.zip';

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
