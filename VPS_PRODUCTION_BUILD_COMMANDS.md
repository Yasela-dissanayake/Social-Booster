# VPS Production Build - Fixed Backend

## Issue Fixed
The build failed because the backend was importing Vite development server code. I've created a production-only backend entry point.

## VPS Build Commands (Updated)

### Option 1: Use Production Entry Point (Recommended)
```bash
cd /var/www/ai-social-backend

# Build with production entry point (no Vite dependencies)
npx esbuild server/index-production.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Start with PM2
pm2 start dist/index-production.js --name "ai-social-backend" --env production
```

### Option 2: Upload Production Entry File First
If you don't have the production file on VPS, create it:

```bash
# Create the production backend file on VPS
cat > server/index-production.ts << 'EOF'
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { aiSecurity } from "./security-service";

const app = express();

// Apply security middleware
const rateLimiters = aiSecurity.createRateLimiters();
const helmetConfig = aiSecurity.getHelmetConfig();

app.use('/api/', rateLimiters.generalLimiter);
app.use('/api/auth/', rateLimiters.authLimiter);
app.use('/api/ai/', rateLimiters.aiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(`[express] Error ${status}: ${message}`);
  });

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api/`);
  });
})();
EOF

# Build and start
npx esbuild server/index-production.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
pm2 start dist/index-production.js --name "ai-social-backend" --env production
```

### Option 3: Use tsx directly (No build needed)
```bash
# Start directly with tsx (bypasses build issues)
npm install -g tsx
pm2 start "tsx server/index-production.ts" --name "ai-social-backend" --env production --interpreter none
```

## Verify Backend is Working

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs ai-social-backend

# Test API locally
curl http://localhost:3000/api/dashboard/stats/1

# Test API externally
curl https://srv885171.hstgr.cloud/api/dashboard/stats/1
```

## What's Different in Production Backend

The production backend:
- ✅ Removes Vite development server dependencies
- ✅ Keeps all API routes and custom AI engine
- ✅ Maintains security and rate limiting
- ✅ Works without frontend build dependencies
- ✅ Ready for PM2 process management

Once this runs successfully, your mobile app will connect to live API endpoints instead of "Offline Mode."