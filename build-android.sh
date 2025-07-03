#!/bin/bash

echo "🔧 Building AI Social Media App for Android..."

# Check if Node.js dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build web assets
echo "📦 Building web assets..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! Make sure 'npm run build' completes successfully."
    exit 1
fi

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync android

# Check if Android project exists
if [ ! -d "android" ]; then
    echo "❌ Android project not found! Make sure Capacitor is properly configured."
    exit 1
fi

# Check if keystore exists, create if not
if [ ! -f "ai-content-keystore.jks" ]; then
    echo "🔑 No keystore found. Creating signing keystore..."
    echo "Please answer the following questions to create your signing key:"
    echo "(Keep the passwords secure - you'll need them for future updates!)"
    keytool -genkey -v -keystore ai-content-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias ai-content-key
    
    if [ ! -f "ai-content-keystore.jks" ]; then
        echo "❌ Keystore creation failed!"
        exit 1
    fi
    echo "✅ Keystore created successfully!"
fi

# Navigate to android directory
cd android

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build debug APK
echo "🔨 Building debug APK..."
./gradlew assembleDebug

# Check if debug build was successful
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ Debug APK generated successfully!"
    DEBUG_SIZE=$(du -h app/build/outputs/apk/debug/app-debug.apk | cut -f1)
    echo "📱 Debug APK: android/app/build/outputs/apk/debug/app-debug.apk ($DEBUG_SIZE)"
else
    echo "❌ Debug APK generation failed!"
    exit 1
fi

# Build signed release APK and AAB
echo "🚀 Building signed release APK..."
./gradlew assembleRelease

if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ Signed release APK generated successfully!"
    RELEASE_SIZE=$(du -h app/build/outputs/apk/release/app-release.apk | cut -f1)
    echo "🚀 Release APK: android/app/build/outputs/apk/release/app-release.apk ($RELEASE_SIZE)"
else
    echo "❌ Release APK generation failed!"
    echo "Check signing configuration in android/app/build.gradle"
fi

echo "📱 Building signed release AAB..."
./gradlew bundleRelease

if [ -f "app/build/outputs/bundle/release/app-release.aab" ]; then
    AAB_SIZE=$(du -h app/build/outputs/bundle/release/app-release.aab | cut -f1)
    
    # Verify AAB is signed
    echo "🔍 Verifying AAB signature..."
    if jarsigner -verify app/build/outputs/bundle/release/app-release.aab > /dev/null 2>&1; then
        echo "✅ AAB is properly signed and ready for Play Store!"
        echo "📦 Signed AAB: android/app/build/outputs/bundle/release/app-release.aab ($AAB_SIZE)"
    else
        echo "❌ AAB signing verification failed!"
        echo "Check signing configuration in android/app/build.gradle"
        exit 1
    fi
else
    echo "❌ Release AAB generation failed!"
    echo "Check signing configuration in android/app/build.gradle"
    exit 1
fi

echo ""
echo "🎉 Build complete!"
echo "📱 Debug APK: android/app/build/outputs/apk/debug/app-debug.apk ($DEBUG_SIZE)"
echo "🚀 Signed Release APK: android/app/build/outputs/apk/release/app-release.apk ($RELEASE_SIZE)"
echo "📦 Signed AAB (Play Store): android/app/build/outputs/bundle/release/app-release.aab ($AAB_SIZE)"
echo ""
echo "📋 Next steps:"
echo "1. Test APK: adb install app/build/outputs/apk/debug/app-debug.apk"
echo "2. Upload AAB to Google Play Console"
echo "3. Complete store listing and publish"
echo ""
echo "💡 Backend Configuration:"
echo "- For local testing: Update capacitor.config.ts with your computer's IP"
echo "- For production: Deploy backend and update URL in capacitor.config.ts"
echo ""
echo "🔐 IMPORTANT: Backup your keystore file (ai-content-keystore.jks) safely!"
echo "Losing it means you can't update your app on Play Store."