# 🚀 Nova Testimonial Deployment Guide

## Current Status
- ✅ Frontend: Deployed on Vercel (`https://nova-testimonial-client.vercel.app`)
- ❌ Backend: Needs to be deployed

## Quick Backend Deployment (Railway - Recommended)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Deploy Backend
```bash
# Navigate to Server directory
cd Server

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Step 3: Set Environment Variables in Railway Dashboard
Go to your Railway project dashboard and add these environment variables:
- `database_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_SECRET_KEY`
- `EMAIL_SERVICE`
- `EMAIL_PASSWORD`
- `CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://nova-testimonial-client.vercel.app`

### Step 4: Update Frontend Environment
1. Get your Railway backend URL (e.g., `https://your-app.railway.app`)
2. Update `Client/.env.production`:
```env
VITE_API_BASE_URL=https://your-app.railway.app
VITE_APP_ENV=production
```

### Step 5: Redeploy Frontend
```bash
# In Client directory
npm run build
# Vercel will auto-deploy when you push to GitHub
```

## Alternative: Render Deployment

### Step 1: Create Render Account
Go to https://render.com and connect your GitHub

### Step 2: Create Web Service
- Repository: Your GitHub repo
- Root Directory: `Server`
- Build Command: `npm install`
- Start Command: `npm start`

### Step 3: Add Environment Variables
Add all the environment variables from your `.env` file

## Testing Both Environments

### Development (localhost)
```bash
# Backend
cd Server && npm run dev

# Frontend  
cd Client && npm run dev
```

### Production
- Backend: Your deployed URL
- Frontend: https://nova-testimonial-client.vercel.app

## Environment Variables Summary

### Backend (.env)
```env
database_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
EMAIL_SERVICE=your_email
EMAIL_PASSWORD=your_email_password
CORS_ORIGIN=http://localhost:5173,http://localhost:3000,https://nova-testimonial-client.vercel.app
```

### Frontend Development (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_ENV=development
```

### Frontend Production (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-url.railway.app
VITE_APP_ENV=production
```

## Troubleshooting

### CORS Issues
- Make sure your backend CORS_ORIGIN includes your frontend URL
- Check that your backend is deployed and accessible

### Environment Variables
- Verify all environment variables are set in your deployment platform
- Check that VITE_API_BASE_URL points to your deployed backend

### API Calls
- Check browser network tab for failed requests
- Verify API endpoints are correct
- Ensure backend is running and accessible