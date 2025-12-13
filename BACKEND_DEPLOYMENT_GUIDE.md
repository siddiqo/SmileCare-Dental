# Backend Deployment Guide - Vercel

## Your Frontend URL
- **Frontend**: https://smilecaredental-mu.vercel.app

## How to Deploy Backend to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Prepare Your Backend
✅ **Already done!** I've created:
- `vercel.json` - Vercel configuration file
- Updated CORS to allow your frontend URL

#### Step 2: Push to GitHub (if not already done)
```bash
cd SmileCare_Server
git add .
git commit -m "Prepare backend for Vercel deployment"
git push
```

#### Step 3: Deploy on Vercel Dashboard

1. **Go to Vercel**: https://vercel.com/
2. **Click "Add New" → "Project"**
3. **Import Your Repository**:
   - If not connected, click "Import Git Repository"
   - Connect your GitHub account
   - Select your `SmileCare-Dental` repository

4. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: Click "Edit" → Select `SmileCare_Server`
   - **Build Settings**: Leave default

5. **Environment Variables** (IMPORTANT!):
   Click "Environment Variables" and add:

   ```
   Name: MONGODB_URI
   Value: your_mongodb_connection_string_here

   Name: PORT
   Value: 5000
   ```

   **How to get MongoDB URI:**
   - Go to MongoDB Atlas (https://cloud.mongodb.com)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

6. **Click "Deploy"**

7. **Wait for deployment** (usually 1-2 minutes)

8. **Copy your backend URL** (will be something like: `https://smile-care-dental-server.vercel.app`)

---

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to backend folder
cd SmileCare_Server

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - Project name? smile-care-server (or your preferred name)
# - Which directory? ./ (current directory)
# - Want to override settings? No

# After deployment, set environment variables
vercel env add MONGODB_URI
# Paste your MongoDB connection string when prompted

vercel env add PORT
# Enter: 5000

# Redeploy with environment variables
vercel --prod
```

---

## After Backend Deployment

### Step 1: Update Frontend Environment Variable

Once your backend is deployed, you'll get a URL like:
`https://your-backend-name.vercel.app`

**Update your frontend**:

1. Go to Vercel Dashboard → Your Frontend Project
2. Go to **Settings** → **Environment Variables**
3. Add or update:
   ```
   Name: REACT_APP_API_URL
   Value: https://your-backend-name.vercel.app
   ```
4. **Redeploy** your frontend

### Step 2: Test Your Application

1. Visit: https://smilecaredental-mu.vercel.app
2. Open browser console (F12)
3. Try to:
   - Register a new account
   - Login
   - Book an appointment
4. Check for any errors in console

---

## Troubleshooting

### MongoDB Connection Issues
**Error**: "Failed to connect to MongoDB"

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Add Vercel IP or use `0.0.0.0/0` (allow from anywhere)
3. Check your connection string format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### CORS Errors
**Error**: "CORS policy blocked"

**Solution**:
- Make sure your frontend URL is in the `allowedOrigins` array
- Redeploy backend after CORS changes

### Environment Variables Not Working
**Error**: "MONGODB_URI is undefined"

**Solution**:
1. Go to Vercel Dashboard → Backend Project → Settings → Environment Variables
2. Verify variables are set for "Production"
3. Redeploy the project

### 404 Errors on API Routes
**Error**: "404 Not Found on /appointments"

**Solution**:
- Ensure `vercel.json` is in the backend root
- Check that `index.js` is the correct entry file
- Redeploy

---

## Environment Variables Checklist

### Backend (Required)
- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `PORT` - Set to 5000

### Frontend (Required)
- ✅ `REACT_APP_API_URL` - Your backend Vercel URL

---

## Quick Reference

### Your URLs
- **Frontend**: https://smilecaredental-mu.vercel.app
- **Backend**: (You'll get this after deployment)

### File Structure
```
SmileCare_Server/
├── index.js          # Main server file
├── vercel.json       # Vercel configuration
├── models/           # Database models
├── package.json      # Dependencies
└── .env              # Local environment variables (not deployed)
```

---

## Need Help?

1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on a deployment → View Function Logs

2. **Check MongoDB Logs**:
   - MongoDB Atlas → Database → Monitoring

3. **Test Backend Directly**:
   - Visit: `https://your-backend-url.vercel.app/dentists`
   - Should return JSON data

---

## Production Checklist

Before going live:
- [ ] MongoDB connection string is correct
- [ ] All environment variables are set in Vercel
- [ ] CORS includes your frontend URL
- [ ] Frontend has correct backend URL
- [ ] Both projects are deployed successfully
- [ ] Test all features (login, register, appointments)
- [ ] Check browser console for errors
- [ ] Test on mobile devices
