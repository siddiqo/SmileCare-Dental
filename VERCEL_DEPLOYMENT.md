# SmileCare Dental - Vercel Deployment Guide

## Your Deployment URLs
- **Frontend**: https://smile-care-dental-kohl.vercel.app/
- **Backend**: https://smile-care-dental-ku7v.vercel.app/

## Setup Instructions

### 1. Configure Frontend Environment Variables

Go to your **Frontend** Vercel project settings:

1. Navigate to: https://vercel.com/your-username/smile-care-dental-kohl
2. Go to **Settings** → **Environment Variables**
3. Add the following variable:

```
Name: REACT_APP_API_URL
Value: https://smile-care-dental-ku7v.vercel.app
```

4. Select all environments (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your frontend project for changes to take effect

### 2. Verify Backend CORS Configuration

The backend has been configured to allow requests from:
- `http://localhost:3000` (for local development)
- `https://smile-care-dental-kohl.vercel.app` (for production)

If you change your frontend URL, update the `allowedOrigins` array in `SmileCare_Server/index.js`.

### 3. Backend Environment Variables

Make sure your backend Vercel project has these environment variables set:

1. Navigate to: https://vercel.com/your-username/smile-care-dental-server
2. Go to **Settings** → **Environment Variables**
3. Ensure these are set:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Redeploy Both Projects

After setting environment variables:

**Option A: Via Vercel Dashboard**
1. Go to your project → **Deployments**
2. Click the three dots on the latest deployment
3. Click **Redeploy**

**Option B: Via Git Push**
```bash
# Make any small change and push
git add .
git commit -m "Update deployment configuration"
git push
```

### 5. Test the Connection

1. Visit your frontend: https://smile-care-dental-kohl.vercel.app/
2. Try to login or register
3. Check browser console (F12) for any CORS or connection errors
4. If you see errors, verify:
   - Environment variables are set correctly
   - Both projects are redeployed
   - MongoDB connection string is valid

## Local Development

For local development, the app will automatically use `http://localhost:5000` as the API URL when `REACT_APP_API_URL` is not set.

To test with the production backend locally:
```bash
# In SmileCare_Client folder
REACT_APP_API_URL=https://smile-care-dental-ku7v.vercel.app npm start
```

## Troubleshooting

### CORS Errors
- Make sure backend's `allowedOrigins` includes your exact frontend URL
- Redeploy backend after CORS changes

### API Connection Errors
- Verify `REACT_APP_API_URL` is set in Vercel frontend settings
- Make sure the URL doesn't have a trailing slash
- Check backend logs in Vercel for errors

### Environment Variables Not Working
- Environment variables require a **redeploy** to take effect
- Make sure variable names match exactly (case-sensitive)
- For React apps, variables must start with `REACT_APP_`

## Important Notes

1. **React Environment Variables**: Must start with `REACT_APP_` to be accessible
2. **No Trailing Slash**: Don't add `/` at the end of API_URL
3. **Redeploy Required**: Changes to environment variables need redeployment
4. **All Environments**: Set variables for Production, Preview, and Development
