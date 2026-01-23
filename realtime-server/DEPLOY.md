# Deployment Guide - Render.com

## Prerequisites
- GitHub account with repository
- Render.com account (free tier)

## Step-by-Step Deployment

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Add Render.com deployment config"
git push origin yariConnect
```

### 2. Create New Web Service on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `hyZenith/GrowthYari`
4. Configure the service:

   **Basic Settings:**
   - **Name:** `growthyari-realtime`
   - **Region:** Choose closest to your users
   - **Branch:** `yariConnect` (or `main` after merge)
   - **Root Directory:** `realtime-server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

### 3. Environment Variables

Add these environment variables in Render dashboard:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `3001` | Auto-detected by Render |
| `REALTIME_SECRET` | `<generate-secret>` | Use: `openssl rand -hex 32` |
| `ALLOWED_ORIGINS` | `https://yourdomain.com` | Your Next.js app URL |

**Generate secure secret:**
```bash
openssl rand -hex 32
```

### 4. Deploy

Click **"Create Web Service"** - Render will:
- Clone your repository
- Install dependencies
- Build TypeScript
- Start the server
- Provide a URL like: `https://growthyari-realtime.onrender.com`

### 5. Update Next.js Environment

Update your main app's `.env.production`:

```bash
NEXT_PUBLIC_REALTIME_URL=https://growthyari-realtime.onrender.com
```

If deploying Next.js on Vercel, add this to your Vercel environment variables.

### 6. Test Connection

After deployment, test the WebSocket connection:

```javascript
// Browser console on your app
const socket = io("https://growthyari-realtime.onrender.com", {
  auth: { token: "your-jwt-token" }
});

socket.on("connect", () => console.log("Connected!"));
```

## Important Notes

### Free Tier Limitations
- **Spins down after 15 minutes** of inactivity
- Cold start takes ~30 seconds
- 750 hours/month free

### Cold Start Handling
Users might experience a delay on first connection after inactivity. Consider:
- Adding a loading message: "Connecting to server..."
- Implementing retry logic (already in your socket config)

### Monitoring
- View logs in Render dashboard
- Check health status at: `https://your-app.onrender.com/health`

### Upgrade Path
If you need always-on service:
- Upgrade to Render's paid plan ($7/month)
- Or switch to Railway/Fly.io with better free tiers

## Troubleshooting

### Connection Fails
1. Check environment variables are set correctly
2. Verify `ALLOWED_ORIGINS` includes your frontend URL
3. Check Render logs for errors

### WebSocket Issues
1. Ensure Render is using WebSocket transport (not polling)
2. Check firewall/proxy settings
3. Verify JWT token is valid

### Build Fails

**Problem:** TypeScript compilation errors like `Could not find a declaration file for module 'jsonwebtoken'`

**Solution:** Already fixed in the latest configuration! The Dockerfile now:
1. Installs all dependencies (including dev dependencies for TypeScript)
2. Compiles TypeScript with type definitions
3. Removes dev dependencies after build for smaller production image

**If you still have build issues:**
1. Check Node.js version (should be 20.x)
2. Verify all dependencies are in package.json
3. Test locally: `npm install && npm run build`
4. Clear Render cache: Dashboard → Settings → Clear Build Cache

## Security Checklist

- [x] Strong REALTIME_SECRET generated
- [x] ALLOWED_ORIGINS configured
- [x] JWT expiration set (1 hour)
- [x] HTTPS enabled (automatic on Render)
- [ ] Add rate limiting (recommended for production)
- [ ] Monitor for abuse

## Next Steps

After successful deployment:
1. Test video calling functionality
2. Monitor connection stability
3. Consider adding Redis for scaling (when needed)
4. Set up TURN server for better connectivity (optional)

## Support

- Render Docs: https://render.com/docs
- Socket.IO Docs: https://socket.io/docs/v4/
- WebRTC Guide: https://webrtc.org/getting-started/overview
