#!/usr/bin/env node

/**
 * Script to help setup a separate backend repository for Vercel deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Backend Repository for Vercel Deployment\n');

console.log('📋 Manual Steps to Deploy Backend on Vercel:');
console.log('\n=== OPTION 1: Separate Repository (Recommended) ===');
console.log('1. Create a new GitHub repository called "nova-testimonial-backend"');
console.log('2. Copy all files from the Server/ directory to the new repo');
console.log('3. Push to GitHub');
console.log('4. Go to Vercel Dashboard');
console.log('5. Click "New Project"');
console.log('6. Import your backend repository');
console.log('7. Vercel will auto-detect it as a Node.js project');

console.log('\n=== OPTION 2: Same Repository (Alternative) ===');
console.log('1. Go to Vercel Dashboard');
console.log('2. Click "New Project"');
console.log('3. Import your current repository');
console.log('4. Set Root Directory to "Server"');
console.log('5. Framework Preset: "Other"');
console.log('6. Build Command: leave empty or "npm install"');
console.log('7. Output Directory: leave empty');
console.log('8. Install Command: "npm install"');

console.log('\n🔧 Environment Variables to Add in Vercel:');
const envPath = path.join(__dirname, 'Server', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  envVars.forEach(envVar => {
    const [key, value] = envVar.split('=');
    if (key && value) {
      console.log(`- ${key}: ${value.startsWith('mongodb') ? '[Your MongoDB URI]' : '[Your Value]'}`);
    }
  });
}

console.log('\n⚠️  IMPORTANT NOTES:');
console.log('- Make sure to add all environment variables in Vercel dashboard');
console.log('- The backend URL will be something like: https://nova-testimonial-backend.vercel.app');
console.log('- Update your frontend .env.production with the new backend URL');

console.log('\n✅ Files prepared for Vercel deployment!');