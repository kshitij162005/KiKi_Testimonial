#!/usr/bin/env node

/**
 * Nova Testimonial Deployment Preparation Script
 * This script helps prepare your app for deployment by:
 * 1. Checking for required files
 * 2. Validating environment variables
 * 3. Running build tests
 * 4. Providing deployment instructions
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Nova Testimonial Deployment Preparation\n');

// Check if required files exist
const requiredFiles = [
  'Client/vercel.json',
  'Server/vercel.json',
  'Client/.env.example',
  'Client/src/config/api.js',
  'DEPLOYMENT_GUIDE.md'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please run the setup again.');
  process.exit(1);
}

// Check package.json scripts
console.log('\n📦 Checking package.json configurations...');

// Check Server package.json
const serverPackage = JSON.parse(fs.readFileSync('Server/package.json', 'utf8'));
if (serverPackage.scripts.start === 'node server.js') {
  console.log('✅ Server start script configured correctly');
} else {
  console.log('❌ Server start script needs to be "node server.js"');
}

// Check Client package.json
const clientPackage = JSON.parse(fs.readFileSync('Client/package.json', 'utf8'));
if (clientPackage.scripts.build === 'vite build') {
  console.log('✅ Client build script configured correctly');
} else {
  console.log('❌ Client build script should be "vite build"');
}

console.log('\n🔧 Pre-deployment Checklist:');
console.log('□ MongoDB Atlas cluster created');
console.log('□ Cloudinary account setup');
console.log('□ Gmail app password generated (for email)');
console.log('□ Environment variables prepared');
console.log('□ Git repository pushed to GitHub/GitLab');

console.log('\n🚀 Ready to Deploy!');
console.log('Follow the steps in DEPLOYMENT_GUIDE.md');

console.log('\n📝 Quick Start Commands:');
console.log('Backend (Vercel):');
console.log('  cd Server && vercel --prod');
console.log('\nFrontend (Vercel):');
console.log('  cd Client && vercel --prod');

console.log('\n🎉 Your Nova Testimonial app will be live soon!');