/**
 * Download Your Complete AI Social Media App
 * Run: node download-app.js
 */

import fs from 'fs';
import path from 'path';

console.log('📱 Creating downloadable package of your AI Social Media App...\n');

// Create a complete backup structure
const appFiles = {
  // Core application files
  'package.json': true,
  'package-lock.json': true,
  'tsconfig.json': true,
  'vite.config.ts': true,
  'tailwind.config.ts': true,
  'postcss.config.js': true,
  'components.json': true,
  'capacitor.config.json': true,
  'drizzle.config.ts': true,
  
  // Source code
  'client/': true,
  'server/': true,
  'shared/': true,
  
  // Documentation and guides
  'ADMIN_SETUP.md': true,
  'DEPLOYMENT_GUIDE.md': true,
  'LAUNCH_CHECKLIST.md': true,
  'PLAY_STORE_SETUP.md': true,
  'PRIVACY_POLICY.md': true,
  'TERMS_OF_SERVICE.md': true,
  'SECURITY_OVERVIEW.md': true,
  'MOBILE_DEPLOYMENT_GUIDE.md': true,
  'android-build-guide.md': true,
  'app-store-assets.md': true,
  'production-checklist.md': true,
  'production-config.js': true,
  'quick-deploy.sh': true,
  'deploy.js': true,
  'verify-deployment.js': true,
  
  // Mobile deployment
  'mobile-deployment.json': true,
  'mobile-deployment-config.json': true,
  
  // Assets
  'generated-icon.png': true,
  'attached_assets/': true
};

// Create backup directory
const backupDir = 'viral-ai-backup';
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Copy files function
function copyFileOrDir(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'android') {
        copyFileOrDir(path.join(src, file), path.join(dest, file));
      }
    });
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

// Copy all important files
console.log('📦 Copying application files...');
Object.keys(appFiles).forEach(file => {
  const srcPath = file;
  const destPath = path.join(backupDir, file);
  
  if (fs.existsSync(srcPath)) {
    try {
      copyFileOrDir(srcPath, destPath);
      console.log(`✅ Copied: ${file}`);
    } catch (error) {
      console.log(`⚠️  Skipped: ${file} (${error.message})`);
    }
  }
});

// Create README for the backup
const readmeContent = `# 🚀 Viral AI - Social Media Generator

## Your Complete AI Social Media Platform

This is your complete AI-powered social media application with all source code, documentation, and deployment guides.

### 🎯 What's Included

**Core Application:**
- Full React + Node.js source code
- AI content generation system
- Admin dashboard with secure authentication
- Multi-platform social media support
- Advanced security monitoring
- Cost-optimized AI integration

**Documentation:**
- Complete deployment guides
- Play Store setup instructions
- Security and privacy policies
- Mobile deployment configuration
- Admin setup instructions

**Ready for:**
✅ Google Play Store publication
✅ Web deployment
✅ Mobile app distribution
✅ Enterprise use

### 🛠️ Quick Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start development:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Deploy to Play Store:**
   \`\`\`bash
   bash quick-deploy.sh
   \`\`\`

### 🔑 Admin Access
- Username: admin
- Password: (generated on first run - check console)

### 📱 Features
- AI content generation for TikTok, Instagram, YouTube, Twitter
- Smart AI agent that learns user styles
- Enterprise security with threat detection
- Analytics and performance tracking
- GDPR compliant with privacy policies
- Mobile-ready with Capacitor

Your AI social media platform is production-ready! 🎉

---
Built with ❤️ using React, Node.js, and OpenAI
`;

fs.writeFileSync(path.join(backupDir, 'README.md'), readmeContent);

console.log('\n🎉 SUCCESS! Your complete AI Social Media App has been saved to:');
console.log(`📁 ${path.resolve(backupDir)}`);
console.log('\n📋 Package includes:');
console.log('✅ Full source code (client + server)');
console.log('✅ All documentation and guides');
console.log('✅ Play Store deployment files');
console.log('✅ Mobile app configuration');
console.log('✅ Security and privacy policies');
console.log('✅ README with setup instructions');
console.log('\n💾 You can now copy this folder anywhere to preserve your app!');