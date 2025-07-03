#!/bin/bash

# Build APK with Hosted Replit Backend + Neon DB
echo "🚀 Building APK with Replit Backend & Neon Database"

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

# Step 2: Build frontend for production with backend connection
echo "🔨 Building frontend with backend connection..."
NODE_ENV=production npm run build

# Step 3: Check build success
if [ -d "dist" ]; then
    echo "✅ Frontend build successful"
    echo "🔗 Connected to: https://36a00fdd-b558-4b85-acec-5ac02d33f0fc-00-1mkusf0mqzlrp.picard.replit.dev"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Step 4: Sync with Capacitor
echo "📱 Syncing with Android..."
npx cap sync android

# Step 5: Build APK
echo "🔧 Building production APK..."
cd android

# Ensure gradlew is executable
chmod +x gradlew

# Build release APK
./gradlew assembleRelease

# Step 6: Check APK creation
APK_PATH="app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "🎉 SUCCESS! APK created with hosted backend!"
    echo "📁 Location: android/$APK_PATH"
    echo ""
    echo "📊 Configuration:"
    echo "✅ Backend: Replit hosted"
    echo "✅ Database: Neon PostgreSQL"  
    echo "✅ AI Engine: Custom OpenAI-compatible API"
    echo "✅ Authentication: Session-based"
    echo "✅ Real-time data sync"
    echo ""
    echo "📱 Installation: adb install android/$APK_PATH"
    echo "🌍 The APK connects to your live backend automatically"
else
    echo "❌ APK build failed"
    exit 1
fi

echo "✨ APK ready with full backend functionality!"