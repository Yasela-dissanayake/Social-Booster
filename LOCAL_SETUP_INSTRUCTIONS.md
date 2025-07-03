# Local Setup Instructions - SocialBooster Project

## Prerequisites Check
Ensure you have these installed:
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Android Studio (for mobile builds)

## Step 1: Install Dependencies
```bash
cd ~/Documents/AI\ app/SocialBooster
npm install
```

## Step 2: Environment Configuration
Create `.env` file in project root:
```bash
# Database (use your existing database or create new one)
DATABASE_URL=postgresql://username:password@localhost:5432/socialbooster

# Required for sessions
SESSION_SECRET=your-secure-session-secret-here

# Optional: OpenAI (you have custom AI engine)
OPENAI_API_KEY=your-openai-key-if-needed

# Development environment
NODE_ENV=development
```

## Step 3: Database Setup
```bash
# Push schema to database
npm run db:push

# This creates all necessary tables
```

## Step 4: Start Development Server
```bash
# Start both frontend and backend
npm run dev
```

## Step 5: Test the Application
1. Open browser: http://localhost:5000
2. Should see your AI Social Media Generator interface
3. Backend APIs should respond correctly

## Step 6: Build Mobile App
```bash
# Sync latest changes to Android
npx cap sync android

# Build APK
cd android
./gradlew clean
./gradlew assembleRelease
```

## Expected Results
- Backend running on port 5000
- Frontend accessible at http://localhost:5000
- Mobile app builds successfully
- All features working: content generation, analytics, scheduling

## Troubleshooting
- If database connection fails: Check DATABASE_URL
- If npm install fails: Try `npm install --legacy-peer-deps`
- If Android build fails: Ensure Android SDK is properly installed

Your local environment will maintain the same cost advantage: $4-10/month vs $245-650/month competitors.