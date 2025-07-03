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