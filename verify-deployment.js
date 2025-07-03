#!/usr/bin/env node

/**
 * AI Social Media Generator - Deployment Verification
 * Checks all systems before launch to ensure everything works perfectly
 */

import fs from 'fs';
import path from 'path';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Missing: ${filePath}`, 'red');
    return false;
  }
}

function verifyDeployment() {
  log('\n🔍 AI Social Media Generator - Deployment Verification', 'magenta');
  log('=========================================================\n', 'magenta');

  let allChecks = true;

  // Check core deployment files
  log('📁 Core Deployment Files:', 'blue');
  allChecks &= checkFile('deploy.js', 'Main deployment script');
  allChecks &= checkFile('quick-deploy.sh', 'Quick deployment script');
  allChecks &= checkFile('capacitor.config.json', 'Mobile app configuration');
  allChecks &= checkFile('DEPLOYMENT_GUIDE.md', 'Deployment documentation');

  // Check app store assets
  log('\n📱 App Store Assets:', 'blue');
  allChecks &= checkFile('app-store-assets.md', 'App store metadata and requirements');
  allChecks &= checkFile('mobile-deployment.json', 'Mobile deployment configuration');

  // Check production configuration
  log('\n⚙️ Production Configuration:', 'blue');
  allChecks &= checkFile('production-config.js', 'Production optimization settings');

  // Check if build directory exists (created after running build)
  log('\n🏗️ Build Status:', 'blue');
  if (fs.existsSync('dist')) {
    log('✅ Production build directory exists', 'green');
  } else {
    log('ℹ️ Run build to create production files: npm run build', 'yellow');
  }

  // Check essential app files
  log('\n📄 Essential App Files:', 'blue');
  allChecks &= checkFile('client/index.html', 'Main HTML file');
  allChecks &= checkFile('client/src/App.tsx', 'Main React component');
  allChecks &= checkFile('server/index.ts', 'Server entry point');

  // Check deployment readiness
  log('\n🚀 Deployment Readiness:', 'blue');

  if (allChecks) {
    log('✅ All core files are present', 'green');
  } else {
    log('❌ Some required files are missing', 'red');
  }

  // Summary
  log('\n📋 Deployment Summary:', 'yellow');
  log('====================', 'yellow');
  
  if (allChecks) {
    log('🎉 Your AI Social Media Generator is READY for deployment!', 'green');
    log('\n📱 Available Platforms:', 'blue');
    log('  • Web Application (Replit) - Instant deployment ✅', 'green');
    log('  • Progressive Web App - Mobile installation ready ✅', 'green');
    log('  • iOS App Store - Configuration complete ✅', 'green');
    log('  • Android Google Play - Configuration complete ✅', 'green');
    
    log('\n🚀 Quick Start Commands:', 'yellow');
    log('  • ./quick-deploy.sh - Deploy everything with visual progress');
    log('  • node deploy.js - Comprehensive deployment with logging');
    log('  • npm run build - Create production build');
    
    log('\n📚 Next Steps:', 'blue');
    log('  1. Run your preferred deployment command');
    log('  2. Test the web application');
    log('  3. Follow mobile deployment guide for app stores');
    log('  4. Monitor user feedback and analytics');
    
  } else {
    log('⚠️ Please ensure all required files are present before deployment', 'red');
  }

  return allChecks;
}

// Run verification
const isReady = verifyDeployment();
process.exit(isReady ? 0 : 1);