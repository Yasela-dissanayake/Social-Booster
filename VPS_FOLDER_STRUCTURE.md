# VPS Server Folder Structure (srv885171.hstgr.cloud)

## Recommended Production Structure

```
/var/www/viral-ai/
├── backend/                          # Your Node.js Express server
│   ├── server/
│   │   ├── index.ts                 # Main server entry point
│   │   ├── routes.ts                # API endpoints
│   │   ├── db.ts                    # Database connection
│   │   ├── storage.ts               # Data storage layer
│   │   ├── my-ai-engine.ts          # Custom AI engine
│   │   ├── admin-auth.ts            # Admin authentication
│   │   ├── image-service.ts         # Image processing
│   │   └── ... (all other server files)
│   ├── shared/
│   │   └── schema.ts                # Database schemas
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   ├── node_modules/
│   └── dist/                        # Compiled backend JS files
│
├── frontend/                         # Your React client app (dist folder)
│   ├── index.html                   # Mobile app interface
│   ├── index.js                     # Bundled React code
│   ├── public/
│   │   ├── assets/
│   │   └── index.html
│   └── ... (other static files)
│
├── uploads/                          # User uploaded images
│   ├── images/
│   └── temp/
│
├── logs/                            # Application logs
│   ├── app.log
│   ├── error.log
│   └── access.log
│
├── scripts/                         # Deployment scripts
│   ├── deploy.sh
│   ├── backup.sh
│   └── restart.sh
│
├── ssl/                             # SSL certificates
│   ├── cert.pem
│   └── privkey.pem
│
└── config/                          # Configuration files
    ├── nginx.conf
    ├── pm2.config.js
    └── .env.production
```

## Current Setup Analysis

**What you have uploaded (dist folder):**
- Location: `/var/www/viral-ai/frontend/`
- Contents: React frontend static files
- Purpose: Mobile app interface and web UI

**What you need for backend:**
- Location: `/var/www/viral-ai/backend/`
- Contents: Node.js Express server with AI engine
- Purpose: API endpoints, database, authentication

## Web Server Configuration

**Nginx Configuration (/etc/nginx/sites-available/viral-ai):**
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name srv885171.hstgr.cloud;
    
    # Serve frontend static files
    location / {
        root /var/www/viral-ai/frontend;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**PM2 Process Management (/var/www/viral-ai/backend/pm2.config.js):**
```javascript
module.exports = {
  apps: [{
    name: 'viral-ai-backend',
    script: './dist/index.js',
    cwd: '/var/www/viral-ai/backend',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/www/viral-ai/logs/error.log',
    out_file: '/var/www/viral-ai/logs/app.log',
    log_file: '/var/www/viral-ai/logs/combined.log'
  }]
}
```

## Deployment Commands

**For Backend Updates:**
```bash
cd /var/www/viral-ai/backend
npm install
npm run build
pm2 restart viral-ai-backend
```

**For Frontend Updates:**
```bash
# Upload new dist folder to:
/var/www/viral-ai/frontend/
```

## File Permissions
```bash
sudo chown -R www-data:www-data /var/www/viral-ai/
sudo chmod -R 755 /var/www/viral-ai/
sudo chmod -R 777 /var/www/viral-ai/uploads/
sudo chmod -R 777 /var/www/viral-ai/logs/
```

## Environment Variables (.env.production)
```
DATABASE_URL=postgresql://username:password@localhost:5432/viral_ai
OPENAI_API_KEY=your_openai_key
SESSION_SECRET=your_session_secret
NODE_ENV=production
PORT=3000
```

Your current setup has the frontend working. You now need to deploy the backend server code to complete the full-stack application.