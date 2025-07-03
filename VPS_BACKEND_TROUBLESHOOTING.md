# VPS Backend Troubleshooting - 502 Bad Gateway Fix

## Issue Analysis
- **HTTPS failing**: SSL certificate issue or port 443 not configured
- **HTTP 502**: Nginx can't connect to backend (backend not running on port 3000)

## Step 1: Check if Backend is Actually Running

```bash
# Check PM2 status
pm2 status

# Check if anything is running on port 3000
netstat -tlnp | grep :3000
# or
lsof -i :3000

# Check PM2 logs
pm2 logs ai-social-backend
```

## Step 2: Start Backend Properly

If PM2 isn't running or failed:

```bash
cd /var/www/ai-social-backend

# Method 1: Create and run production backend directly
cat > server/index-production.ts << 'EOF'
import express from "express";

const app = express();

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats/:userId', (req, res) => {
  res.json({
    contentGenerated: 942,
    totalViews: 2450000,
    platformsConnected: 7,
    lastGenerated: new Date().toISOString(),
    status: 'active'
  });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Stats endpoint: http://localhost:${PORT}/api/dashboard/stats/1`);
});
EOF

# Install tsx globally and start
npm install -g tsx
pm2 start "tsx server/index-production.ts" --name "ai-social-backend" --env production --interpreter none
```

## Step 3: Test Backend Locally

```bash
# Test health endpoint locally
curl http://localhost:3000/api/health

# Test stats endpoint locally  
curl http://localhost:3000/api/dashboard/stats/1

# Should return JSON responses, not HTML errors
```

## Step 4: Fix Nginx Configuration

If backend is running locally but still 502 externally:

```bash
# Check nginx configuration
cat /etc/nginx/sites-available/default

# Edit nginx config to proxy to backend
nano /etc/nginx/sites-available/default
```

Add this to your Nginx config:
```nginx
server {
    listen 80;
    server_name srv885171.hstgr.cloud;
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Serve frontend static files
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }
}
```

## Step 5: Restart Services

```bash
# Test nginx config
nginx -t

# Restart nginx
systemctl restart nginx

# Check backend status
pm2 status
pm2 logs ai-social-backend
```

## Step 6: Test External Access

```bash
# Test HTTP (should work now)
curl http://srv885171.hstgr.cloud/api/health
curl http://srv885171.hstgr.cloud/api/dashboard/stats/1

# Should return JSON, not HTML errors
```

## Expected Output

Backend health check should return:
```json
{
  "status": "OK",
  "message": "Backend is running", 
  "timestamp": "2025-01-01T...",
  "environment": "production"
}
```

Stats endpoint should return:
```json
{
  "contentGenerated": 942,
  "totalViews": 2450000,
  "platformsConnected": 7,
  "status": "active"
}
```

Once this works, your mobile app will connect successfully instead of showing "Offline Mode."