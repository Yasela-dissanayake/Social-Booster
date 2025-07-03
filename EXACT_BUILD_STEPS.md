# Exact Build Steps - Mobile App with VPS Backend

## Current Setup
- Downloaded complete SocialBooster project
- Backend deployed at srv885171.hstgr.cloud (working)
- Need to build APK that connects to deployed backend

## Step 1: Navigate to Project
```bash
cd ~/Documents/AI\ app/SocialBooster
```

## Step 2: Install Dependencies (if needed)
```bash
npm install
```

## Step 3: Verify Capacitor Configuration
Check that `capacitor.config.ts` has clean config (no server URL redirect):
- Should NOT contain: `url: 'http://srv885171.hstgr.cloud'`
- Should only have basic configuration

## Step 4: Sync Web Assets to Android
```bash
npx cap sync android
```

## Step 5: Navigate to Android Project
```bash
cd android
```

## Step 6: Clean Previous Builds
```bash
./gradlew clean
```

## Step 7: Build Release APK
```bash
./gradlew assembleRelease
```

## Step 8: Locate Your APK
Find the built APK at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Step 9: Install and Test
```bash
# Install on connected device
adb install app/build/outputs/apk/release/app-release.apk
```

## Expected Result
- App shows AI Social Generator dashboard
- Connects to srv885171.hstgr.cloud for live data
- No white screen (fixed with recent updates)
- Full functionality with zero subscription costs

## If Any Step Fails
- Step 2: Try `npm install --legacy-peer-deps`
- Step 4: Ensure `capacitor.config.ts` has clean configuration
- Step 7: Check Android SDK is properly installed

Ready to proceed?