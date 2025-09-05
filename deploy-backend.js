#!/usr/bin/env node

/**
 * Backend Deployment Script for Nova Testimonial
 * This script helps deploy the backend to various platforms
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Nova Testimonial Backend Deployment Helper\n');

// Check if Server directory exists
const serverDir = path.join(__dirname, 'Server');
if (!fs.existsSync(serverDir)) {
  console.error('❌ Server directory not found!');
  process.exit(1);
}

console.log('✅ Server directory found');

// Check required files
const requiredFiles = [
  'server.js',
  'package.json',
  '.env'
];

const missingFiles = requiredFiles.filter(file => 
  !fs.existsSync(path.join(serverDir, file))
);

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles.join(', '));
  process.exit(1);
}

console.log('✅ All required files present');

// Display deployment options
console.log('\n📋 Deployment Options:');
console.log('1. Railway (Recommended)');
console.log('2. Render');
console.log('3. Heroku');
console.log('4. Vercel (Serverless)');

console.log('\n🔧 Backend Deployment Instructions:');
console.log('\n=== RAILWAY DEPLOYMENT (Recommended) ===');
console.log('1. Install Railway CLI: npm install -g @railway/cli');
console.log('2. Login: railway login');
console.log('3. Navigate to Server directory: cd Server');
console.log('4. Initialize: railway init');
console.log('5. Deploy: railway up');
console.log('6. Set environment variables in Railway dashboard');

console.log('\n=== RENDER DEPLOYMENT ===');
console.log('1. Go to https://render.com');
console.log('2. Connect your GitHub repository');
console.log('3. Create a new Web Service');
console.log('4. Set Build Command: npm install');
console.log('5. Set Start Command: npm start');
console.log('6. Set Root Directory: Server');
console.log('7. Add environment variables');

console.log('\n=== ENVIRONMENT VARIABLES TO SET ===');
const envContent = fs.readFileSync(path.join(serverDir, '.env'), 'utf8');
const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
envVars.forEach(envVar => {
  const [key] = envVar.split('=');
  if (key) {
    console.log(`- ${key}`);
  }
});

console.log('\n⚠️  IMPORTANT: Never commit .env files to git!');
console.log('✅ Your backend is ready for deployment!');