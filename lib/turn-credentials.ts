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
export function getIceServers(userId: string): RTCIceServer[] {
  const iceServers: RTCIceServer[] = [];

  // Always include Google STUN servers
  iceServers.push({
    urls: [
      "stun:stun.l.google.com:19302",
      "stun:stun1.l.google.com:19302",
    ],
  });

  // Add TURN server if configured (production)
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
