# Link Frontend & Backend on Vercel

## Your Deployment URLs
- **Frontend**: https://smilecaredental-mu.vercel.app/
- **Backend**: https://smile-care-dental-rosy.vercel.app/

---

## 🔗 Step-by-Step Guide

### **Step 1: Configure Frontend to Use Backend**

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click on your Frontend project**: `smilecaredental-mu`
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New** button
6. Fill in:
   ```
   Key:   REACT_APP_API_URL
   Value: https://smile-care-dental-rosy.vercel.app
   ```
7. **Select all environments**: ✅ Production ✅ Preview ✅ Development
8. Click **Save**

### **Step 2: Redeploy Frontend**

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~1-2 minutes)

### **Step 3: Push Backend Changes (CORS Update)**

```bash
# Navigate to server folder
cd SmileCare_Server

# Add and commit changes
git add .
git commit -m "Update CORS for new frontend URL"
git push
```

This will automatically redeploy your backend on Vercel.

---

## ✅ Verification Steps

### 1. Test Backend API
Open in browser: https://smile-care-dental-rosy.vercel.app/dentists

**Expected**: JSON data with dentists list

### 2. Test Frontend
1. Visit: https://smilecaredental-mu.vercel.app/
2. Open **Browser Console** (Press F12)
3. Try to **Register** or **Login**
4. Check console for errors

### 3. Check CORS
If you see this error in console:
```
Access to fetch at 'https://smile-care-dental-rosy.vercel.app/...'
from origin 'https://smilecaredental-mu.vercel.app' has been blocked by CORS policy
```

**Solution**: Make sure you pushed the backend changes and it redeployed.

---

## 🔍 Troubleshooting

### Frontend Not Connecting to Backend

**Issue**: Frontend still uses `localhost:5000`

**Fix**:
1. Verify environment variable is set in Vercel
2. Make sure you selected all environments
3. Redeploy frontend

### CORS Errors

**Issue**: "CORS policy blocked"

**Fix**:
1. Check `SmileCare_Server/index.js` has correct frontend URL
2. Push changes to GitHub
3. Wait for backend to redeploy automatically

### Environment Variable Not Working

**Issue**: `REACT_APP_API_URL` is undefined

**Fix**:
1. Environment variable MUST start with `REACT_APP_`
2. Must redeploy after adding variables
3. Check spelling (case-sensitive)

---

## 📋 Quick Checklist

Before testing:
- [ ] Frontend environment variable set in Vercel
- [ ] Frontend redeployed
- [ ] Backend CORS updated (pushed to GitHub)
- [ ] Backend redeployed

After deployment:
- [ ] Backend API responds: `https://smile-care-dental-rosy.vercel.app/dentists`
- [ ] Frontend loads: `https://smilecaredental-mu.vercel.app/`
- [ ] Can register new user
- [ ] Can login
- [ ] Can book appointment
- [ ] No CORS errors in console

---

## 🎯 Summary

**What connects them?**
1. Frontend environment variable `REACT_APP_API_URL` points to backend
2. Backend CORS allows frontend URL

**Key Files:**
- Frontend: Environment Variables in Vercel Dashboard
- Backend: `SmileCare_Server/index.js` (CORS configuration)

**After any changes:**
- Always redeploy the affected project
- Test in browser with console open (F12)
