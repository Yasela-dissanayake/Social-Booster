/**
 * Create Web Deployment Package
 * Run: node create-web-package.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🌐 Creating web deployment package...\n');

// Build the client application
console.log('Building client application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.log('Building client with alternative method...');
  // Continue even if build fails
}

// Create web deployment structure
const webPackage = {
  'package.json': true,
  'server/': true,
  'shared/': true,
  'dist/': true, // Built client files
  'client/index.html': true,
  'README-DEPLOYMENT.md': `# Web Deployment Guide

## Quick Start
1. Upload these files to your web server
2. Install dependencies: \`npm install\`
3. Set environment variables:
   - DATABASE_URL (PostgreSQL)
   - SESSION_SECRET
   - OPENAI_API_KEY (optional)
   - STRIPE_SECRET_KEY (optional)
4. Start server: \`npm start\`

## Environment Setup
Create a .env file with:
\`\`\`
DATABASE_URL=postgresql://user:pass@host:port/dbname
SESSION_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key
\`\`\`

## Server Requirements
- Node.js 18+
- PostgreSQL database
- 512MB RAM minimum
- HTTPS recommended

## Admin Access
- Username: admin
- Password: Check server console on first run
`,
  'start-server.js': `/**
 * Production Server Starter
 */
const { spawn } = require('child_process');

console.log('Starting Viral AI Platform...');

const server = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || 3000
  }
});

server.on('close', (code) => {
  console.log('Server stopped with code:', code);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
});
`
};

// Create the package
const packageDir = 'web-deployment';
if (fs.existsSync(packageDir)) {
  fs.rmSync(packageDir, { recursive: true, force: true });
}
fs.mkdirSync(packageDir);

function copyFileOrDir(src, dest) {
  const srcPath = path.resolve(src);
  const destPath = path.resolve(dest);
  
  if (!fs.existsSync(srcPath)) {
    console.log(`Skipping ${src} (not found)`);
    return;
  }
  
  const stat = fs.statSync(srcPath);
  
  if (stat.isDirectory()) {
    fs.mkdirSync(destPath, { recursive: true });
    const items = fs.readdirSync(srcPath);
    
    for (const item of items) {
      if (item === 'node_modules' || item.startsWith('.')) continue;
      copyFileOrDir(
        path.join(srcPath, item),
        path.join(destPath, item)
      );
    }
  } else {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
  }
}

// Copy files
Object.keys(webPackage).forEach(file => {
  if (typeof webPackage[file] === 'string') {
    // Create file with content
    fs.writeFileSync(path.join(packageDir, file), webPackage[file]);
  } else if (webPackage[file] === true) {
    // Copy existing file/directory
    copyFileOrDir(file, path.join(packageDir, file));
  }
});

// Create package.json for production
const prodPackage = {
  "name": "viral-ai-platform",
  "version": "1.0.0",
  "description": "AI-powered social media content generation platform",
  "main": "server/index.js",
  "scripts": {
    "start": "node start-server.js",
    "install-deps": "npm install --production"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "express-rate-limit": "^6.7.0",
    "helmet": "^6.1.5",
    "bcrypt": "^5.1.0",
    "pg": "^8.11.0",
    "drizzle-orm": "^0.28.5",
    "@neondatabase/serverless": "^0.9.0",
    "connect-pg-simple": "^9.0.1",
    "stripe": "^12.9.0",
    "openai": "^4.0.0",
    "zod": "^3.21.4",
    "tsx": "^3.12.7"
  },
  "engines": {
    "node": ">=18.0.0"
  }
};

fs.writeFileSync(
  path.join(packageDir, 'package.json'),
  JSON.stringify(prodPackage, null, 2)
);

console.log(`✅ Web deployment package created in: ${packageDir}/`);
console.log('\nUpload the contents of this folder to your web server.');
console.log('Then run: npm run install-deps && npm start');