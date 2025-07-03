# VPS Backend Deployment - Complete Steps

## Issue: Backend Not Built

The error occurs because the TypeScript backend hasn't been compiled to JavaScript. Here are the complete deployment steps:

## Step 1: Upload Backend Source Code

Upload your complete backend folder to the VPS:

```bash
# Create backend directory on VPS
ssh root@srv885171.hstgr.cloud "mkdir -p /var/www/ai-social-backend"

# Upload all backend files from Replit to VPS
scp -r server/ root@srv885171.hstgr.cloud:/var/www/ai-social-backend/
scp -r shared/ root@srv885171.hstgr.cloud:/var/www/ai-social-backend/
scp package.json root@srv885171.hstgr.cloud:/var/www/ai-social-backend/
scp package-lock.json root@srv885171.hstgr.cloud:/var/www/ai-social-backend/
scp tsconfig.json root@srv885171.hstgr.cloud:/var/www/ai-social-backend/
scp drizzle.config.ts root@srv885171.hstgr.cloud:/var/www/ai-social-backend/
scp ecosystem.config.js root@srv885171.hstgr.cloud:/var/www/ai-social-backend/
```

## Step 2: Install Dependencies and Build

SSH into your VPS and build the backend:

```bash
ssh root@srv885171.hstgr.cloud
cd /var/www/ai-social-backend

# Install Node.js dependencies
npm install

# Build TypeScript to JavaScript
npm run build
# This creates the dist/ folder with compiled JavaScript

# Verify build was successful
ls -la dist/
# Should see index.js and other compiled files
```

## Step 3: Create Environment File

Create production environment variables:

```bash
# Create .env.production file
cat > .env.production << 'EOF'
DATABASE_URL=your_postgresql_database_url
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
NODE_ENV=production
PORT=3000
EOF
```

## Step 4: Create Logs Directory

```bash
mkdir -p /var/www/ai-social-backend/logs
```

## Step 5: Start Backend with PM2

```bash
# Start the compiled backend
pm2 start dist/index.js --name "ai-social-backend" --env production

# Or use the ecosystem config
pm2 start ecosystem.config.js
```

## Step 6: Verify Backend is Running

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs ai-social-backend

# Test API endpoint
curl http://localhost:3000/api/dashboard/stats/1
curl https://srv885171.hstgr.cloud/api/dashboard/stats/1
```

## Files You Need to Upload to VPS:

From your Replit project, upload these to `/var/www/ai-social-backend/`:

```
server/                     # All backend TypeScript files
shared/                     # Database schemas
package.json               # Dependencies
package-lock.json          # Lock file
tsconfig.json             # TypeScript config
drizzle.config.ts         # Database config
ecosystem.config.js       # PM2 config (fixed version)
```

## Alternative: One-Command Build Script

You can also create a deploy script:

```bash
# Create deploy.sh on VPS
cat > deploy.sh << 'EOF'
#!/bin/bash
cd /var/www/ai-social-backend
npm install
npm run build
pm2 restart ai-social-backend || pm2 start dist/index.js --name "ai-social-backend" --env production
pm2 save
EOF

chmod +x deploy.sh
./deploy.sh
```

Once the backend is built and running, your mobile app will connect to the live API endpoints instead of showing "Offline Mode."