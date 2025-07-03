# VPS Deployment Commands - Fixed PM2 Configuration

## Updated PM2 Configuration

The `ecosystem.config.js` file has been fixed to use ES module syntax:

```javascript
export default {
  apps: [{
    name: 'ai-social-backend',
    script: './dist/index.js',
    cwd: '/var/www/ai-social-backend',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/www/ai-social-backend/logs/error.log',
    out_file: '/var/www/ai-social-backend/logs/app.log',
    log_file: '/var/www/ai-social-backend/logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

## VPS Deployment Steps

1. **Upload the fixed ecosystem.config.js to your VPS:**
```bash
# Copy the fixed file to your server
scp ecosystem.config.js root@srv885171.hstgr.cloud:/var/www/ai-social-backend/
```

2. **Create logs directory:**
```bash
mkdir -p /var/www/ai-social-backend/logs
```

3. **Start PM2 with the fixed configuration:**
```bash
cd /var/www/ai-social-backend
pm2 start ecosystem.config.js
```

4. **Verify the backend is running:**
```bash
pm2 status
pm2 logs ai-social-backend
```

5. **Test the API endpoints:**
```bash
curl https://srv885171.hstgr.cloud/api/dashboard/stats/1
```

## Alternative PM2 Start Commands

If the ecosystem config still has issues, you can start PM2 directly:

```bash
# Start directly without config file
pm2 start dist/index.js --name "ai-social-backend" --env production

# Or with environment variables
pm2 start dist/index.js --name "ai-social-backend" -i 1 --env production --log /var/www/ai-social-backend/logs/app.log
```

## Environment Setup

Make sure your `.env.production` file exists:
```bash
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_key
SESSION_SECRET=your_session_secret
NODE_ENV=production
PORT=3000
```

The fixed configuration uses ES module syntax which matches your Node.js setup on the VPS.