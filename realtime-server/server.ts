import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, replace with specific domain
    methods: ["GET", "POST"]
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

  // Initial state: Online but networking availability depends on client signal or DB default
  // For now, we assume user sends 'join-networking' event to explicitly make themselves visible
  
  socket.on("join-networking", (data: { networkingAvailable: boolean }) => {
    if (data.networkingAvailable) {
      onlineUsers.set(user.id, {
        ...user,
        socketId: socket.id,
        status: "ONLINE",
        networkingAvailable: true
      });
      
      // Broadcast updated list to all in networking pool
      io.emit("users-update", Array.from(onlineUsers.values()));
    }
  });

  socket.on("leave-networking", () => {
    onlineUsers.delete(user.id);
    io.emit("users-update", Array.from(onlineUsers.values()));
  });

  // Call Request
  socket.on("call-request", (data: { toUserId: string }) => {
    const targetUser = onlineUsers.get(data.toUserId);
    if (!targetUser) {
      socket.emit("call-error", { message: "User is offline or unavailable" });
      return;
    }
    
    if (targetUser.status === "BUSY") {
        socket.emit("call-error", { message: "User is currently busy" });
        return;
    }

    io.to(targetUser.socketId).emit("incoming-call", {
      from: {
        id: user.id,
        name: user.name,
        image: user.image,
        bio: user.bio,
        industry: user.industry
      },
      signal: null // Start with simple request, signal later or here
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
    // Determine who ended it.
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
            other.status = "ONLINE"; // Or wait for them to signal? Safer to force reset if they confirm end
            onlineUsers.set(other.id, other);
            io.to(other.socketId).emit("call-ended", { byUserId: user.id });
        }
    }
    
    io.emit("users-update", Array.from(onlineUsers.values()));
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${user.name}`);
    onlineUsers.delete(user.id);
    io.emit("users-update", Array.from(onlineUsers.values()));
  });
});

httpServer.listen(PORT, () => {
  console.log(`Realtime server running on port ${PORT}`);
});
