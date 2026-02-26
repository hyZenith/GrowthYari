# YariConnect Debugging Guide

## Issue: Users shown but not "ONLINE"

### Checklist to Debug:

#### 1. Check Environment Variables

**On your Next.js deployment (Vercel/etc):**
```bash
NEXT_PUBLIC_REALTIME_URL=https://your-realtime-server.onrender.com
REALTIME_SECRET=<same-secret-as-realtime-server>
```

**On Render (realtime-server):**
```bash
REALTIME_SECRET=<same-secret-as-frontend>
ALLOWED_ORIGINS=https://your-frontend-domain.com
PORT=3001
```

**⚠️ CRITICAL:** Both `REALTIME_SECRET` values MUST match exactly!

#### 2. Test Realtime Server Health

Open your browser and visit:
```
https://your-realtime-server.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-01-24T..."
}
```

If this fails, your server isn't running.

#### 3. Check Browser Console

Open YariConnect page and check browser console (F12):

**Good signs:**
```
Connected to messaging server
User <name> networking status: true
```

**Bad signs:**
```
WebSocket connection failed
Authentication error
CORS error
```

#### 4. Check Network Tab

In browser DevTools → Network tab:
- Look for `socket.io` connection
- Should show Status: `101 Switching Protocols` (WebSocket upgrade)
- If it shows 404, 500, or connection refused → server not reachable

#### 5. Verify CORS Settings

In Render logs for realtime-server, check:
```
ALLOWED_ORIGINS should include your frontend URL
```

If you see CORS errors, add your frontend domain to ALLOWED_ORIGINS.

#### 6. Check JWT Token

In browser console, run:
```javascript
// Check if token is being sent
const token = sessionStorage.getItem('socket_token') || localStorage.getItem('socket_token');
console.log('Token:', token);
```

#### 7. Check User's networkingAvailable Status

Run this on your database:
```sql
SELECT id, name, "networkingAvailable" FROM "User" WHERE id = 'your-user-id';
```

If `networkingAvailable` is `false`, users won't show as ONLINE.

---

## Quick Fixes:

### Fix 1: Enable Networking for User

Go to `/settings` page and toggle "Available for Networking" ON.

### Fix 2: Check Render Logs

1. Go to Render Dashboard
2. Select your realtime-server
3. Click "Logs" tab
4. Look for errors like:
   - "Authentication error"
   - "CORS error"
   - Connection failures

### Fix 3: Verify REALTIME_SECRET Matches

**Get secret from Render:**
- Dashboard → realtime-server → Environment → REALTIME_SECRET

**Update Next.js deployment:**
- Add same value to your frontend's environment variables

### Fix 4: Update ALLOWED_ORIGINS

In Render, update ALLOWED_ORIGINS to include your frontend URL:
```
https://your-app.vercel.app,https://www.your-domain.com
```

---

## Testing Script

Run this in your browser console on the YariConnect page:

```javascript
// Test socket connection
const io = window.io || require('socket.io-client');
const testSocket = io('https://your-realtime-server.onrender.com', {
  auth: { token: 'your-token-here' },
  transports: ['websocket']
});

testSocket.on('connect', () => console.log('✅ Connected!'));
testSocket.on('connect_error', (err) => console.error('❌ Error:', err));
testSocket.on('users-update', (users) => console.log('👥 Online users:', users));
```

---

## Common Issues:

### Issue: "Connection refused"
**Cause:** NEXT_PUBLIC_REALTIME_URL is wrong or server is down
**Fix:** Check environment variable and test /health endpoint

### Issue: "Authentication error"
**Cause:** REALTIME_SECRET mismatch or invalid token
**Fix:** Ensure secrets match on both frontend and backend

### Issue: "CORS error"
**Cause:** Frontend domain not in ALLOWED_ORIGINS
**Fix:** Add your domain to ALLOWED_ORIGINS on Render

### Issue: Users shown but offline
**Cause:** networkingAvailable is false in database
**Fix:** Enable networking in /settings page

### Issue: Socket connects but no users
**Cause:** No other users have networking enabled
**Fix:** Have multiple users enable networking

---

## Expected Flow:

1. User visits `/yariconnect`
2. JWT token generated with `networkingAvailable: true`
3. Socket connects to realtime server
4. Server checks token, marks user ONLINE
5. Server emits `users-update` to all clients
6. Client receives list of online users
7. Users displayed with green status badges

---

## Next Steps:

1. Open `/yariconnect` in your browser
2. Open Developer Console (F12)
3. Look for connection logs
4. Share any error messages you see
5. Check Render logs for server-side errors
