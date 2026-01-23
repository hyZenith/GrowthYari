# YariConnect Realtime Server

WebSocket signaling server for YariConnect video calling feature.

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings
# At minimum, set REALTIME_SECRET

# Start development server
npm run dev
```

Server runs on `http://localhost:3001`

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 📦 Tech Stack

- **Express** - HTTP server
- **Socket.IO** - WebSocket real-time communication
- **JWT** - Authentication
- **TypeScript** - Type safety

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Server port |
| `REALTIME_SECRET` | Yes | - | JWT signing secret |
| `ALLOWED_ORIGINS` | Yes | `localhost:3000` | CORS allowed origins |
| `NODE_ENV` | No | `development` | Environment mode |

**Generate secure secret:**
```bash
openssl rand -hex 32
```

## 🌐 Deployment

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions on Render.com.

### Quick Deploy to Render

1. Push to GitHub
2. Connect repository on [Render.com](https://render.com)
3. Set Root Directory: `realtime-server`
4. Add environment variables
5. Deploy!

## 📡 API Endpoints

### Health Check
```
GET /health
```

Returns server status and uptime.

## 🔌 Socket Events

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `call-request` | `{ toUserId: string }` | Initiate call to user |
| `call-accepted` | `{ toUserId: string }` | Accept incoming call |
| `call-rejected` | `{ toUserId: string }` | Reject incoming call |
| `signal` | `{ toUserId: string, signal: any }` | WebRTC signaling |
| `end-call` | `{ toUserId: string }` | End active call |

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `users-update` | `User[]` | Online users list |
| `incoming-call` | `{ from: User }` | Incoming call notification |
| `call-accepted` | `{ fromUserId: string }` | Call was accepted |
| `call-rejected` | `{ fromUserId: string }` | Call was rejected |
| `call-ended` | `{ byUserId: string }` | Call ended by other party |
| `call-error` | `{ message: string }` | Error occurred |
| `signal` | `{ fromUserId: string, signal: any }` | WebRTC signaling |

## 🔐 Authentication

All Socket.IO connections require JWT authentication:

```javascript
const socket = io("http://localhost:3001", {
  auth: {
    token: "your-jwt-token"
  }
});
```

Token payload must include:
```typescript
{
  id: string;
  name: string;
  networkingAvailable: boolean;
  // ... other user fields
}
```

## 📊 Monitoring

- **Health Check:** `GET /health`
- **Logs:** Check console output or Render dashboard
- **Metrics:** Monitor connection count via Socket.IO admin UI (optional)

## 🔍 Troubleshooting

### Connection Issues

**Problem:** Cannot connect to server

**Solutions:**
- Verify server is running
- Check `ALLOWED_ORIGINS` includes your frontend URL
- Ensure JWT token is valid
- Check firewall/proxy settings

### Authentication Errors

**Problem:** "Authentication error: Invalid token"

**Solutions:**
- Verify `REALTIME_SECRET` matches between Next.js app and realtime server
- Check token hasn't expired (1 hour default)
- Ensure token payload includes required fields

### Build Errors

**Problem:** TypeScript compilation fails

**Solutions:**
```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build
```

## 📈 Scaling

Current setup uses in-memory storage. For production at scale:

1. **Add Redis Adapter**
   ```bash
   npm install ioredis @socket.io/redis-adapter
   ```

2. **Update server.ts**
   ```typescript
   import { createAdapter } from "@socket.io/redis-adapter";
   import { createClient } from "redis";

   const pubClient = createClient({ url: process.env.REDIS_URL });
   const subClient = pubClient.duplicate();

   await Promise.all([pubClient.connect(), subClient.connect()]);
   io.adapter(createAdapter(pubClient, subClient));
   ```

3. **Deploy Multiple Instances**
   - Use load balancer with sticky sessions
   - All instances share state via Redis

## 📝 License

Part of GrowthYari - YariConnect networking platform.

## 🤝 Contributing

This is the realtime server component. See main repository README for contributing guidelines.
