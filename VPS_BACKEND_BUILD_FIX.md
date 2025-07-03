# VPS Backend Build Fix - Backend Only Deployment

## Issue
The build failed because `vite build` is trying to build a frontend, but on VPS you only need the backend server.

## Solution
Use backend-only build commands:

```bash
# On your VPS, replace the current package.json with backend-only version
cd /var/www/ai-social-backend

# Remove the vite build from the command, only build backend
npm run build:backend
```

## Updated Build Commands for VPS

### Option 1: Direct esbuild (Recommended)
```bash
# Build backend only
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Start with PM2
pm2 start dist/index.js --name "ai-social-backend" --env production
```

### Option 2: Use TypeScript compiler
```bash
# Compile TypeScript to JavaScript
npx tsc --outDir dist

# Start with PM2  
pm2 start dist/server/index.js --name "ai-social-backend" --env production
```

### Option 3: Use tsx directly (No build needed)
```bash
# Install tsx globally
npm install -g tsx

# Start directly with tsx
pm2 start "tsx server/index.ts" --name "ai-social-backend" --env production --interpreter none
```

## Files You Need on VPS

Your VPS backend directory should contain:
```
/var/www/ai-social-backend/
├── server/                    # All your Express server files
├── shared/                    # Database schemas
├── package.json               # Backend dependencies only
├── tsconfig.json             # TypeScript config
├── drizzle.config.ts         # Database config
├── .env.production           # Environment variables
└── ecosystem.config.js       # PM2 config
```

## Complete VPS Deployment Steps

1. **Build backend only:**
```bash
cd /var/www/ai-social-backend
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
```

2. **Verify build output:**
```bash
ls -la dist/
# Should see index.js
```

3. **Start with PM2:**
```bash
pm2 start dist/index.js --name "ai-social-backend" --env production
```

4. **Check status:**
```bash
pm2 status
pm2 logs ai-social-backend
```

5. **Test API:**
```bash
curl http://localhost:3000/api/dashboard/stats/1
```

The key is to only build the backend server, not the frontend (which is already deployed separately).