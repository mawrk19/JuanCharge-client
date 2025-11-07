# Vercel Deployment Guide for JuanCharge

## Environment Variables Setup

Since Vercel doesn't recognize `VITE_` prefixed environment variables during build time, we need to set non-prefixed versions in the Vercel dashboard.

### Required Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add the following:

```
APP_NAME=JuanCharge
API_BASE_URL=https://juancharge-backend-production.up.railway.app/api
BACKEND_URL=https://juancharge-backend-production.up.railway.app
APP_URL=https://juan-charge-client-1ang.vercel.app
ENV=production
SANCTUM_STATEFUL_DOMAINS=juan-charge-client-1ang.vercel.app
SESSION_DOMAIN=.vercel.app
```

**Important:** Make sure to set these for **Production**, **Preview**, and **Development** environments in Vercel.

## How It Works

The codebase now supports both prefixed and non-prefixed environment variables:

```javascript
// In src/service/axios.js and src/boot/axios.js
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ||  // Development (with Vite)
                   import.meta.env.API_BASE_URL ||       // Production (Vercel)
                   '/api';                                // Fallback
```

### Development (Local)
- Uses `VITE_API_BASE_URL` and `VITE_BACKEND_URL` from `.env`
- Vite's dev server proxy handles requests to `http://localhost:8000`

### Production (Vercel)
- Uses `API_BASE_URL` and `BACKEND_URL` from Vercel environment variables
- Direct calls to Railway backend at `https://juancharge-backend-production.up.railway.app`

## Deployment Steps

1. **Update Backend CORS (Railway)**
   
   Make sure your Laravel backend allows requests from:
   ```
   https://juan-charge-client-1ang.vercel.app
   ```

   In your Laravel `.env` (Railway):
   ```
   SANCTUM_STATEFUL_DOMAINS=juan-charge-client-1ang.vercel.app
   SESSION_DOMAIN=.vercel.app
   CORS_ALLOWED_ORIGINS=https://juan-charge-client-1ang.vercel.app
   ```

2. **Set Environment Variables in Vercel**
   
   As listed above in the Required Environment Variables section.

3. **Build and Deploy**
   
   ```bash
   npm run build
   ```
   
   Then push to GitHub or deploy via Vercel CLI.

4. **Redeploy After Setting Variables**
   
   After adding environment variables, trigger a new deployment in Vercel to ensure they're included in the build.

## Testing

To verify the deployment:

1. Open browser console on `https://juan-charge-client-1ang.vercel.app`
2. Try logging in
3. Check Network tab - requests should go to:
   ```
   https://juancharge-backend-production.up.railway.app/api/auth/login
   ```
   NOT to:
   ```
   https://juan-charge-client-1ang.vercel.app/api/auth/login
   ```

## Troubleshooting

### 404 on API routes
- ✅ **Correct:** `https://juancharge-backend-production.up.railway.app/api/auth/login`
- ❌ **Wrong:** `https://juan-charge-client-1ang.vercel.app/api/auth/login`

If you see 404 errors, check:
1. Environment variables are set in Vercel
2. You've redeployed after setting variables
3. Backend CORS is configured correctly

### CORS Errors
Update your Laravel backend's `config/cors.php`:
```php
'allowed_origins' => [
    'https://juan-charge-client-1ang.vercel.app',
],
```

### 401 Unauthorized
- Check JWT token is being sent in Authorization header
- Verify backend JWT secret is correct
- Ensure token hasn't expired
