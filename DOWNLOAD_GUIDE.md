# Download Guide - AI Social Media Platform

## Available Downloads

### 1. Complete App Packages
- **viral-ai-app.tar.gz** (40.6 MB) - Full application with dependencies
- **viral-ai-complete-app.tar.gz** (2.9 MB) - Streamlined package

### 2. Mobile App Store
- **android/** folder - Google Play Store ready files
- **PLAY_STORE_SETUP.md** - Submission instructions

### 3. Website Deployment
- Current running application can be deployed directly to any hosting platform

## How to Download

### Option 1: Download Existing Packages
```bash
# Download the complete app
# Files are ready: viral-ai-app.tar.gz and viral-ai-complete-app.tar.gz
```

### Option 2: Create Fresh Package
```bash
# Run the download script
node download-app.js
```

## Deployment Instructions

### For Website Hosting:
1. Upload all files to your web server
2. Install dependencies: `npm install`
3. Set environment variables:
   - DATABASE_URL
   - SESSION_SECRET
   - OPENAI_API_KEY (optional)
4. Start: `npm start`

### For Google Play Store:
1. Use files in `android/` folder
2. Follow `PLAY_STORE_SETUP.md` guide
3. Submit to Play Console

### Admin Access
- Username: admin
- Password: Check server console on startup
- Dashboard: yoursite.com/admin

## Requirements
- Node.js 18+
- PostgreSQL database
- HTTPS recommended for production
- 512MB RAM minimum

## Support Files Included
- Complete documentation
- Privacy policy and terms
- Security overview
- Deployment guides
- Legal compliance documents