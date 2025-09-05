# 🚀 Nova Testimonial Deployment Guide

## 📋 **Deployment Strategy Overview**

- **Frontend**: Vercel (Perfect for React + Dynamic Routes)
- **Backend**: Vercel (Node.js + Express with serverless functions)
- **Database**: MongoDB Atlas (Free tier available)
- **File Storage**: Cloudinary (Already configured)

---

## 🎯 **Step 1: Prepare Environment Variables**

### **Backend Environment Variables (.env)**

Create these in Railway dashboard:

```env
# Database
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/nova-testimonial

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
EMAIL_SERVICE=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password

# Port
PORT=3000

# CORS Origin (Update after frontend deployment)
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### **Frontend Environment Variables**

Create these in Vercel dashboard:

```env
# API Base URL (Update after backend deployment)
VITE_API_BASE_URL=https://your-backend-domain.railway.app

# Any other frontend configs
VITE_APP_NAME=Nova Testimonial
```

---

## 🗄️ **Step 2: Setup MongoDB Atlas**

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier (M0)
3. **Create Database User**:
   - Username: `nova-admin`
   - Password: Generate strong password
4. **Network Access**: Add `0.0.0.0/0` (Allow from anywhere)
5. **Get Connection String**:
   ```
   mongodb+srv://nova-admin:<password>@cluster0.xxxxx.mongodb.net/nova-testimonial
   ```

---

## 🚂 **Step 3: Deploy Backend to Vercel**

### **Using Vercel CLI (Recommended)**

```bash
# Navigate to server directory
cd Server

# Deploy backend
vercel --prod

# Add environment variables via Vercel dashboard:
# - DATABASE_URI
# - JWT_SECRET
# - EMAIL_SERVICE
# - EMAIL_PASSWORD
# - CLOUDINARY_CLOUD_NAME
# - CLOUDINARY_API_KEY
# - CLOUDINARY_API_SECRET
# - CORS_ORIGIN (your frontend URL)
```

### **Using Vercel Dashboard**

1. Go to [Vercel](https://vercel.com)
2. **Import Project** → **Import Git Repository**
3. **Select Repository**: Your Nova Testimonial repo
4. **Framework Preset**: Other
5. **Root Directory**: `Server`
6. **Environment Variables**: Add all the variables listed above
7. **Deploy**

### **Get Backend URL**

After deployment, Vercel will provide a URL like:

```
https://your-backend-name.vercel.app
```

---

## ⚡ **Step 4: Deploy Frontend to Vercel**

### **Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client directory
cd Client

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? nova-testimonial
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add VITE_API_BASE_URL
# Enter: https://your-backend-domain.railway.app

# Redeploy with env vars
vercel --prod
```

### **Option B: Using Vercel Dashboard**

1. Go to [Vercel](https://vercel.com)
2. **Import Project** → **Import Git Repository**
3. **Select Repository**: Your Nova Testimonial repo
4. **Framework Preset**: Vite
5. **Root Directory**: `Client`
6. **Environment Variables**: Add `VITE_API_BASE_URL`
7. **Deploy**

### **Get Frontend URL**

Vercel will provide a URL like:

```
https://nova-testimonial.vercel.app
```

---

## 🔧 **Step 5: Update CORS Configuration**

After getting your frontend URL, update the backend CORS:

```bash
# In Vercel dashboard, add/update environment variable:
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

Your server.js already has the correct CORS configuration:

```javascript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
```

---

## 🔗 **Step 6: Update API URLs in Frontend**

Update all API calls in your React app to use the environment variable:

```javascript
// Instead of: http://localhost:3000
// Use: import.meta.env.VITE_API_BASE_URL

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Example usage:
const response = await fetch(
  `${API_BASE_URL}/api/organization/${userId}/feedbacks`
);
```

---

## ✅ **Step 7: Test Your Deployment**

### **Test Checklist:**

- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads
- [ ] Create space functionality works
- [ ] Dynamic URLs work (e.g., `yoursite.com/my-space`)
- [ ] Feedback submission works
- [ ] API integration endpoints work
- [ ] File uploads work (Cloudinary)
- [ ] Email functionality works

---

## 🛠️ **Troubleshooting Common Issues**

### **CORS Errors**

```javascript
// Add to server.js
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.vercel.app",
    ],
    credentials: true,
  })
);
```

### **Environment Variables Not Loading**

- Ensure variables are set in Railway/Vercel dashboards
- Restart deployments after adding variables
- Check variable names match exactly

### **Database Connection Issues**

- Verify MongoDB Atlas connection string
- Check network access settings (0.0.0.0/0)
- Ensure database user has proper permissions

### **Dynamic Routes Not Working**

- Verify `vercel.json` is in Client directory
- Check that rewrites configuration is correct

---

## 🎉 **Step 8: Custom Domain (Optional)**

### **For Frontend (Vercel):**

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### **For Backend (Railway):**

1. Go to Railway dashboard → Your project → Settings → Domains
2. Add custom domain
3. Update DNS records

---

## 📊 **Monitoring & Maintenance**

### **Vercel Analytics**

- Enable Vercel Analytics for frontend performance monitoring
- Monitor Core Web Vitals

### **Vercel Analytics**

- Monitor backend performance in Vercel dashboard
- Set up alerts for downtime

### **Database Monitoring**

- Use MongoDB Atlas monitoring
- Set up alerts for connection issues

---

## 💰 **Cost Breakdown**

### **Free Tier Limits:**

- **Vercel**: 100GB bandwidth, unlimited deployments, serverless functions
- **MongoDB Atlas**: 512MB storage (free forever)
- **Cloudinary**: 25 credits/month (free)

### **Estimated Monthly Cost**: $0 for small to medium usage (completely free!)

---

## 🔄 **Continuous Deployment**

Both platforms support automatic deployments:

- **Push to main branch** → Auto-deploy to production
- **Push to develop branch** → Deploy to preview/staging

---

## 🚀 **Ready to Deploy?**

Run these commands to get started:

```bash
# 1. Setup MongoDB Atlas (manual step)
# 2. Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 3. Deploy Backend to Vercel
cd Server
vercel --prod
# Add environment variables via Vercel dashboard

# 4. Deploy Frontend to Vercel
cd ../Client
vercel --prod
# Add VITE_API_BASE_URL via Vercel dashboard

# 5. Test everything!
```

Your Nova Testimonial app will be live and ready for users! 🎉
