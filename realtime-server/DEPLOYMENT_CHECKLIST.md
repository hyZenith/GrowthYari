# Render.com Deployment Checklist

## ✅ Pre-Deployment

- [x] Dockerfile created
- [x] .dockerignore created
- [x] render.yaml created
- [x] package.json updated with build scripts
- [x] Health check endpoint added
- [x] TypeScript compiles successfully
- [x] README.md and DEPLOY.md created

## 🔑 Before You Deploy

### 1. Generate Secrets
```bash
# Generate REALTIME_SECRET
openssl rand -hex 32
```
Copy this value - you'll need it for Render environment variables.

### 2. Get Your Frontend URL
You need to know your Next.js app URL for ALLOWED_ORIGINS:
- **Development:** `http://localhost:3000`
- **Production (Vercel):** `https://your-app.vercel.app`
- **Production (Custom):** `https://yourdomain.com`

### 3. Commit and Push
```bash
git add realtime-server/
git commit -m "Configure realtime-server for Render.com deployment"
git push origin yariConnect
```

## 🚀 Render.com Setup

### Step 1: Create Web Service
1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub: `hyZenith/GrowthYari`
4. Grant repository access

### Step 2: Configure Service

**Basic Configuration:**
```
Name: growthyari-realtime
Region: [Choose closest to your users]
Branch: yariConnect
Root Directory: realtime-server
Runtime: Node
```

**Build Settings:**
```
Build Command: npm install && npm run build
Start Command: npm start
```

**Instance Type:**
```
Free (512 MB RAM, 0.1 CPU)
```

### Step 3: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `3001` | `3001` |
| `REALTIME_SECRET` | `<your-generated-secret>` | `abc123...` (from openssl) |
| `ALLOWED_ORIGINS` | `<your-frontend-url>` | `https://growthyari.vercel.app` |

⚠️ **IMPORTANT:** Keep `REALTIME_SECRET` safe! Don't commit it to git.

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. Note your service URL: `https://growthyari-realtime.onrender.com`

## 🔗 Update Your Next.js App

### For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   ```
   NEXT_PUBLIC_REALTIME_URL=https://growthyari-realtime.onrender.com
   ```
4. Redeploy your Next.js app

### For Local Development

Update your `.env.local`:
```bash
NEXT_PUBLIC_REALTIME_URL=http://localhost:3001  # Keep for local testing
# OR
NEXT_PUBLIC_REALTIME_URL=https://growthyari-realtime.onrender.com  # Test production
```

### Update .env.production (if using)
```bash
NEXT_PUBLIC_REALTIME_URL=https://growthyari-realtime.onrender.com
```

## ✅ Verify Deployment

### Test Health Endpoint
```bash
curl https://growthyari-realtime.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2026-01-23T..."
}
```

### Test WebSocket Connection

Open browser console on your app:
```javascript
const socket = io("https://growthyari-realtime.onrender.com", {
  auth: { token: "your-jwt-token" }
});

socket.on("connect", () => console.log("✅ Connected!"));
socket.on("connect_error", (err) => console.error("❌ Error:", err));
```

## 🐛 Troubleshooting

### Build Failed

**Check Render logs:**
1. Go to your service dashboard
2. Click **"Logs"** tab
3. Look for error messages

**Common issues:**
- Missing dependencies: Check package.json
- TypeScript errors: Run `npm run build` locally
- Node version mismatch: Render uses Node 20

### Connection Failed

**Check CORS:**
- Verify `ALLOWED_ORIGINS` includes your frontend URL (with https://)
- Check for trailing slashes
- Make sure origins are comma-separated (no spaces)

**Check JWT:**
- Verify `REALTIME_SECRET` matches in both apps
- Check token hasn't expired
- Ensure token payload includes `networkingAvailable` field

### Service Sleeping (Free Tier)

**Expected behavior:**
- Service spins down after 15 minutes of inactivity
- Cold start takes ~30 seconds on next connection

**Solution:**
- Accept the delay (free tier)
- OR upgrade to paid plan ($7/month) for always-on

## 📊 Monitoring

### View Logs
```
Render Dashboard → Your Service → Logs tab
```

### Check Metrics
```
Render Dashboard → Your Service → Metrics tab
```

Monitor:
- CPU usage
- Memory usage
- Request count
- Response time

## 🔄 Redeploy

### Automatic Redeploy
Every push to `yariConnect` branch triggers auto-deploy.

### Manual Redeploy
```
Render Dashboard → Your Service → Manual Deploy button
```

## 🎉 Success!

Your realtime server is now deployed. Test the video calling feature:

1. Open your app in two different browsers
2. Enable networking availability for both users
3. Try to connect and start a call
4. Verify video/audio works

## 📝 Next Steps

- [ ] Set up TURN server for better connectivity (optional)
- [ ] Add monitoring/alerting
- [ ] Configure custom domain (optional)
- [ ] Plan for Redis when scaling (when needed)
- [ ] Set up staging environment

## 🆘 Need Help?

- **Render Docs:** https://render.com/docs
- **Render Support:** https://render.com/support
- **Socket.IO Docs:** https://socket.io/docs/v4/
- **WebRTC Guide:** https://webrtc.org/

---

**Estimated Time:** 15-20 minutes
**Cost:** Free (with limitations)
**Difficulty:** Easy 🟢
