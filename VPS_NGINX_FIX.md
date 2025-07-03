# VPS Nginx Configuration Fix

## Issue
Backend is running on port 3000 but Nginx returns 502 Bad Gateway, meaning Nginx can't proxy to the backend.

## Fix Nginx Configuration

Run these commands on your VPS:

```bash
# Check current nginx config
cat /etc/nginx/sites-available/default

# Backup current config
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Create new nginx config that properly proxies API requests
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name srv885171.hstgr.cloud;
    
    # Proxy all /api/ requests to backend on port 3000
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Serve frontend static files
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        index index.html;
    }
}
EOF

# Test nginx configuration
nginx -t

# If test passes, restart nginx
systemctl restart nginx

# Check nginx status
systemctl status nginx
```

## Verify Backend and Nginx

```bash
# 1. Check backend is running locally
curl http://localhost:3000/api/health

# 2. Check PM2 status
pm2 status

# 3. Test external API access
curl http://srv885171.hstgr.cloud/api/health
curl http://srv885171.hstgr.cloud/api/dashboard/stats/1
```

## Alternative Nginx Test

If the above doesn't work, try a simpler proxy configuration:

```bash
# Simple nginx config
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80;
    server_name srv885171.hstgr.cloud;
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location / {
        root /var/www/html;
        index index.html;
    }
}
EOF

nginx -t && systemctl restart nginx
```

## Debug Commands

```bash
# Check if nginx is running
systemctl status nginx

# Check nginx error logs
tail -f /var/log/nginx/error.log

# Check nginx access logs
tail -f /var/log/nginx/access.log

# Check what's listening on port 80
netstat -tlnp | grep :80

# Check backend port
netstat -tlnp | grep :3000
```

Once Nginx properly proxies /api/ requests to port 3000, your mobile app will connect successfully.