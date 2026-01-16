import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

const REALTIME_SECRET = process.env.REALTIME_SECRET || "super-secret-key_CHANGE_ME";

export async function generateSocketToken(user: User) {
  const payload = {
    id: user.id,
    name: user.name,
    image: user.image,
    bio: user.bio,
    industry: 'Technology', // Fallback or fetch specific field if not in User type locally
    // Add other fields as needed
  };

  // Sign with valid duration (e.g., 1 hour)
  return jwt.sign(payload, REALTIME_SECRET, { expiresIn: "1h" });
}
