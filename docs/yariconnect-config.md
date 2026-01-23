# YariConnect Environment Configuration

## Required Environment Variables

### Next.js Application (.env)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/growthyari

# Authentication
JWT_SECRET=your-jwt-secret-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Realtime Server
REALTIME_SECRET=your-realtime-secret-key-here
NEXT_PUBLIC_REALTIME_URL=http://localhost:3001

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LinkedIn OAuth (if using)
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

---

## Realtime Server (.env in realtime-server directory)

```bash
# Server Configuration
PORT=3001
REALTIME_SECRET=your-realtime-secret-key-here

# Database (for future database access if needed)
DATABASE_URL=postgresql://user:password@localhost:5432/growthyari

# Redis (Optional - for horizontal scaling)
# Leave commented for single-instance development
# REDIS_URL=redis://localhost:6379

# TURN Server (Production Only)
# Leave commented for development (uses Google STUN only)
# TURN_SERVER_URL=turn:your-turn-server.com:3478
# TURN_SECRET=your-turn-shared-secret
# TURN_USERNAME=growthyari
```

---

## Development Setup

### 1. Install Dependencies

**Main Application**:
```bash
npm install
```

**Realtime Server**:
```bash
cd realtime-server
npm install
cd ..
```

### 2. Run Database Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 3. Start Development Servers

**Terminal 1 - Next.js**:
```bash
npm run dev
```

**Terminal 2 - Realtime Server**:
```bash
cd realtime-server
npm run dev
```

---

## Production Deployment

### Environment Variables for Production

**Additional variables for production**:

```bash
# Next.js
NODE_ENV=production
NEXT_PUBLIC_REALTIME_URL=https://realtime.yourdomain.com

# Realtime Server
NODE_ENV=production
PORT=3001

# Redis (Required for multi-instance)
REDIS_URL=redis://your-redis-host:6379

# TURN Server (Required)
TURN_SERVER_URL=turn:your-turn-server.com:3478
TURN_SECRET=your-turn-shared-secret
TURN_USERNAME=growthyari
```

### Security Checklist

- [ ] Generate strong secrets (use `openssl rand -hex 32`)
- [ ] Enable HTTPS for main application
- [ ] Enable WSS (WebSocket Secure) for realtime server
- [ ] Configure CORS properly (restrict origins)
- [ ] Set up TURN server with SSL
- [ ] Enable Redis authentication
- [ ] Use environment-specific secrets (don't reuse dev secrets)

---

## Horizontal Scaling with Redis

To run multiple realtime server instances:

### 1. Install Redis

```bash
# Ubuntu/Debian
sudo apt install redis-server

# macOS
brew install redis
```

### 2. Update Realtime Server

The code is already prepared for Redis. Just add these dependencies:

```bash
cd realtime-server
npm install ioredis @socket.io/redis-adapter
```

### 3. Set REDIS_URL

```bash
REDIS_URL=redis://localhost:6379
```

### 4. Load Balancer

Use Nginx or your cloud provider's load balancer to distribute connections across multiple realtime server instances.

**Example Nginx config**:
```nginx
upstream realtime {
    ip_hash;  # Sticky sessions
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

server {
    listen 80;
    server_name realtime.yourdomain.com;

    location / {
        proxy_pass http://realtime;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Testing Configuration

### Verify Environment Variables

**Next.js**:
```bash
npm run build
# Should succeed without errors
```

**Realtime Server**:
```bash
cd realtime-server
npm run build
node dist/server.js
# Should show: "Realtime server running on port 3001"
```

### Test YariConnect Flow

1. Create a test user with `networkingAvailable = true`
2. Visit `/yariconnect`
3. Verify user appears in the list (even if offline initially)
4. Open in another browser/incognito
5. Log in as second user with `networkingAvailable = true`
6. Verify both users see each other's online status
7. Initiate a video call
8. Check browser console for ICE candidates
9. Verify video/audio connection establishes

---

## Security Notes

### Secret Generation

Generate cryptographically secure secrets:

```bash
# For JWT_SECRET, REALTIME_SECRET, NEXTAUTH_SECRET
openssl rand -hex 32

# For TURN_SECRET
openssl rand -hex 32
```

### CORS Configuration

For production, update `realtime-server/server.ts`:

```typescript
const io = new Server(httpServer, {
  cors: {
    origin: "https://yourdomain.com",  // Replace * with actual domain
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

---

## Common Issues

### "Module not found" errors in realtime-server

Run `npm install` in the `realtime-server` directory.

### Socket.IO connection fails

- Verify `NEXT_PUBLIC_REALTIME_URL` is correct
- Check firewall allows port 3001
- Verify realtime server is running
- Check browser console for connection errors

### Video call fails to connect

- Check browser has camera/microphone permissions
- Verify STUN server is accessible (Google STUN should always work)
- For production, verify TURN server is running and configured
- Check browser console for ICE candidate errors

---

## Summary

This configuration enables:
- ✅ Secure authentication across services
- ✅ Real-time presence tracking via Socket.IO
- ✅ WebRTC video calling with STUN/TURN
- ✅ Horizontal scaling with Redis (production)
- ✅ Proper separation of development and production configs
