#!/bin/bash

# 📱 ONE-CLICK PLAY STORE DEPLOYMENT
# Just run: bash quick-deploy.sh

echo "🚀 Building your AI Social Media App for Play Store..."
echo ""

# Step 1: Build everything
echo "📦 Step 1: Building app..."
npm run build
echo "✅ Web app built!"

# Step 2: Add Android
echo "📱 Step 2: Adding Android platform..."
npx cap add android
echo "✅ Android added!"

# Step 3: Sync to Android
echo "🔄 Step 3: Syncing to Android..."
npx cap sync android
echo "✅ Synced!"

echo ""
echo "🎉 SUCCESS! Your app is ready!"
echo ""
echo "NEXT: Open Android Studio and build:"
echo "1. Run: npx cap open android"
echo "2. In Android Studio: Build → Generate Signed Bundle"
echo "3. Upload the .aab file to Play Console"
echo ""
echo "📱 Your AI app will be on Play Store soon!"