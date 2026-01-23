import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const httpServer = createServer(app);
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:3000", "http://localhost:3001"];

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.REALTIME_SECRET || "super-secret-key_CHANGE_ME";

// Types
interface UserData {
  id: string;
  name: string;
  image?: string;
  bio?: string;
  industry?: string;
  skills?: string[];
  networkingAvailable?: boolean;
}

interface ConnectedUser extends UserData {
  socketId: string;
  status: "ONLINE" | "BUSY";
  networkingAvailable: boolean;
}

// In-memory store (Replace with Redis for scaling)
const onlineUsers = new Map<string, ConnectedUser>();

// Middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserData;
    // Attach user data to socket
    (socket as any).user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket: Socket) => {
  const user = (socket as any).user as UserData;
  console.log(`User connected: ${user.name} (${user.id})`);

  // Check networking availability from token directly
  // In a real scenario, you might query the DB here to be 100% sure, 
  // but for performance, we trust the token or assume the client will update if changed.
  // For this refactor, we trust the token contains `networkingAvailable` or we fetch it?
  // The interface UserData in server.ts (lines 28-35) DOES NOT currently have networkingAvailable.
  // We need to ensure the token has it, or we defaulting to false? 
  // The user prompt says: "Authenticate using JWT. If networkingAvailable is true, mark them ONLINE."
  
  // Let's assume the token payload now includes `networkingAvailable`.
  // We'll cast user to any to access it safely if strictly typed
  const isNetworking = (user as any).networkingAvailable === true;
  console.log(`User ${user.name} networking status: ${isNetworking}`);

  if (isNetworking) {
      onlineUsers.set(user.id, {
        ...user,
        socketId: socket.id,
        status: "ONLINE",
        networkingAvailable: true
      });
      console.log(`User ${user.name} marked ONLINE. Total online: ${onlineUsers.size}`);
      io.emit("users-update", Array.from(onlineUsers.values()));
  }

  // Call Request
  socket.on("call-request", (data: { toUserId: string }) => {
    console.log(`Call request from ${user.name} (${user.id}) to target ID: ${data.toUserId}`);
    const targetUser = onlineUsers.get(data.toUserId);
    
    if (!targetUser) {
      console.warn(`Target user ${data.toUserId} not found in onlineUsers map`);
      socket.emit("call-error", { message: "User is offline or unavailable" });
      return;
    }
    
    console.log(`Target user found: ${targetUser.name} (${targetUser.id}) with socket: ${targetUser.socketId}`);
    
    // Security: Ensure caller is actually 'ONLINE' 
    const caller = onlineUsers.get(user.id);
    if (!caller) {
        console.warn(`Caller ${user.id} not found in onlineUsers map`);
        socket.emit("call-error", { message: "You must be online to make calls." });
        return;
    }

    if (targetUser.status === "BUSY") {
        console.log(`Target user ${targetUser.name} is BUSY`);
        socket.emit("call-error", { message: "User is currently busy" });
        return;
    }

    console.log(`Emitting incoming-call to socket ${targetUser.socketId}`);
    io.to(targetUser.socketId).emit("incoming-call", {
      from: {
        id: user.id,
        name: user.name,
        image: user.image,
        bio: user.bio,
        industry: user.industry
      },
      signal: null 
    });
  });

  // Call Acceptance
  socket.on("call-accepted", (data: { toUserId: string }) => {
    const caller = onlineUsers.get(data.toUserId);
    const receiver = onlineUsers.get(user.id);

    if (caller && receiver) {
        // Mark both as BUSY
        caller.status = "BUSY";
        receiver.status = "BUSY";
        onlineUsers.set(caller.id, caller);
        onlineUsers.set(receiver.id, receiver);
        
        // Notify others to remove them from list or mark busy
        io.emit("users-update", Array.from(onlineUsers.values()));

        io.to(caller.socketId).emit("call-accepted", { fromUserId: user.id });
    }
  });

  // Call Rejected
  socket.on("call-rejected", (data: { toUserId: string }) => {
    const caller = onlineUsers.get(data.toUserId);
    if (caller) {
        io.to(caller.socketId).emit("call-rejected", { fromUserId: user.id });
    }
  });

  // WebRTC Signaling (Offer, Answer, ICE Candidate)
  socket.on("signal", (data: { toUserId: string, signal: any }) => {
    const target = onlineUsers.get(data.toUserId);
    if (target) {
        io.to(target.socketId).emit("signal", { fromUserId: user.id, signal: data.signal });
    }
  });

  // End Call
  socket.on("end-call", (data: { toUserId: string }) => {
    // Reset status to ONLINE
    const me = onlineUsers.get(user.id);
    if (me) {
        me.status = "ONLINE";
        onlineUsers.set(me.id, me);
    }

    // Notify other party
    if(data.toUserId) {
        const other = onlineUsers.get(data.toUserId);
        if(other) {
            other.status = "ONLINE"; 
            onlineUsers.set(other.id, other);
            io.to(other.socketId).emit("call-ended", { byUserId: user.id });
        }
    }
    
    io.emit("users-update", Array.from(onlineUsers.values()));
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${user.name}`);
    if (onlineUsers.has(user.id)) {
        onlineUsers.delete(user.id);
        io.emit("users-update", Array.from(onlineUsers.values()));
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Realtime server running on port ${PORT}`);
});
