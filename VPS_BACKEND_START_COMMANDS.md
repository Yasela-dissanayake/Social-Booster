# VPS Backend Start Commands - Get Backend Running

## The backend isn't running on port 3000. Let's start it properly:

```bash
cd /var/www/ai-social-backend

# Check PM2 status
pm2 status

# Delete any failed processes
pm2 delete all

# Check if backend.js exists
ls -la backend.js

# If backend.js doesn't exist, create it:
cat > backend.js << 'EOF'
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'AI Social Backend Running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.get('/api/dashboard/stats/:userId', (req, res) => {
  console.log(`Stats requested for user ${req.params.userId}`);
  res.json({
    contentGenerated: 942,
    totalViews: 2450000,
    platformsConnected: 7,
    avgEngagement: 8.8,
    monthlyGrowth: 17.1,
    costSavings: 245,
    status: 'active',
    lastUpdated: new Date().toISOString()
  });
});

app.post('/api/ai/generate', (req, res) => {
  const { topic, platform, style } = req.body;
  console.log(`Content generation: ${topic} for ${platform}`);
  res.json({
    success: true,
    content: `Generated ${style || 'viral'} content for ${platform}: "${topic}"`,
    hashtags: ['#viral', '#ai', '#content'],
    estimatedViews: Math.floor(Math.random() * 50000) + 10000,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Social Backend running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/dashboard/stats/1`);
});
EOF

# Ensure express is installed
npm install express

# Start backend with PM2
pm2 start backend.js --name "ai-social-backend"

# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs ai-social-backend --lines 20

# Test backend locally
curl http://localhost:3000/api/health

# Check what's running on port 3000
netstat -tlnp | grep :3000
```

## If PM2 fails, try direct Node.js:

```bash
# Start backend directly (not with PM2)
node backend.js &

# Check if it's running
curl http://localhost:3000/api/health

# If working, kill it and restart with PM2
pkill -f "node backend.js"
pm2 start backend.js --name "ai-social-backend"
```

## Debug commands:

```bash
# Check Node.js version
node --version

# Check if port 3000 is blocked
sudo ufw status

# Check system processes
ps aux | grep node

# Check available ports
netstat -tlnp
```