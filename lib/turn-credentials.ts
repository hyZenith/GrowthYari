import crypto from "crypto";

/**
 * Generate time-limited TURN credentials for WebRTC
 * Uses HMAC-based authentication with shared secret
 * 
 * @param username - Username for TURN authentication (typically user ID)
 * @param secret - Shared secret configured on TURN server
 * @param ttl - Time-to-live in seconds (default 24 hours)
 * @returns TURN credentials object
 */
export function generateTurnCredentials(
  username: string,
  secret?: string,
  ttl: number = 86400 // 24 hours
) {
  const turnSecret = secret || process.env.TURN_SECRET;
  
  if (!turnSecret) {
    console.warn("TURN_SECRET not configured, TURN server will not work");
    return null;
  }

  // Generate timestamp-based username
  const timestamp = Math.floor(Date.now() / 1000) + ttl;
  const turnUsername = `${timestamp}:${username}`;

  // Generate HMAC password
  const hmac = crypto.createHmac("sha1", turnSecret);
  hmac.update(turnUsername);
  const turnPassword = hmac.digest("base64");

  return {
    username: turnUsername,
    credential: turnPassword,
  };
}

/**
 * Get ICE server configuration for WebRTC
 * Returns STUN servers for development and TURN servers for production
 * 
 * @param userId - User ID for TURN authentication
 * @returns Array of RTCIceServer configuration objects
 */
export async function getIceServers(userId: string): Promise<RTCIceServer[]> {
  const iceServers: RTCIceServer[] = [];

  // Always include Google STUN servers
  iceServers.push({
    urls: [
      "stun:stun.l.google.com:19302",
      "stun:stun1.l.google.com:19302",
      "stun:stun2.l.google.com:19302",
      "stun:stun3.l.google.com:19302",
      "stun:stun4.l.google.com:19302",
    ],
  });

  // Additional free STUN servers as backup
  iceServers.push({
    urls: [
      "stun:stun.relay.metered.ca:80",
      "stun:global.stun.twilio.com:3478",
      "stun:stun.cloudflare.com:3478",
    ],
  });

  // Add Metered.ca TURN servers (dynamic credentials)
  try {
    const meteredApiKey = process.env.METERED_API_KEY ;
    const response = await fetch(`https://growthyari.metered.live/api/v1/turn/credentials?apiKey=${meteredApiKey}`);
    
    if (response.ok) {
      const meteredServers = await response.json();
      iceServers.push(...meteredServers);
      console.log("✅ Metered.ca TURN servers loaded successfully");
    } else {
      console.warn("⚠️  Failed to fetch Metered.ca TURN credentials, using fallback");
      // Fallback to static Metered.ca configuration
      iceServers.push({
        urls: "turn:global.relay.metered.ca:80",
        username: "50ffab20de11c4d9727721cc",
        credential: "YEpBoVxQ5m2H49ia",
      });
      iceServers.push({
        urls: "turn:global.relay.metered.ca:80?transport=tcp",
        username: "50ffab20de11c4d9727721cc",
        credential: "YEpBoVxQ5m2H49ia",
      });
      iceServers.push({
        urls: "turns:global.relay.metered.ca:443?transport=tcp",
        username: "50ffab20de11c4d9727721cc",
        credential: "YEpBoVxQ5m2H49ia",
      });
    }
  } catch (error) {
    console.error("❌ Error fetching Metered.ca TURN servers:", error);
    // Fallback to static configuration
    iceServers.push({
      urls: "turn:global.relay.metered.ca:80",
      username: "50ffab20de11c4d9727721cc",
      credential: "YEpBoVxQ5m2H49ia",
    });
  }

  // Add custom TURN server if configured (self-hosted)
  const turnServerUrl = process.env.TURN_SERVER_URL;
  if (turnServerUrl) {
    const turnCreds = generateTurnCredentials(userId);
    if (turnCreds) {
      iceServers.push({
        urls: turnServerUrl,
        username: turnCreds.username,
        credential: turnCreds.credential,
      });
    }
  }

  return iceServers;
}
