import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSocketToken } from "@/lib/socket-auth";
import { redirect } from "next/navigation";
import YariConnectClient from "./YariConnectClient";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const metadata = {
    title: "YariConnect - Realtime Networking",
};

export default async function YariConnectPage() {
    const session = await auth();
    let userId = session?.user?.id;

    // If no NextAuth session, check for custom JWT cookies (user_token or admin_token)
    if (!userId) {
        const cookieStore = await cookies();
        const token = cookieStore.get("user_token")?.value || cookieStore.get("admin_token")?.value;

        if (token && process.env.JWT_SECRET) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
                userId = decoded.userId;
            } catch (error) {
                console.error("YariConnect: Invalid custom JWT", error);
            }
        }
    }

    if (!userId) {
        console.log("Debug YariConnect: No session user ID found via NextAuth or Custom JWT");
        redirect("/auth/login?callbackUrl=/yariconnect");
    }

    // Fetch fresh user data including networking status
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        redirect("/auth/login");
    }

    const token = await generateSocketToken(user);

    return (
        <YariConnectClient
            token={token}
            currentUser={user}
            initialNetworkingAvailable={user.networkingAvailable}
        />
    );
}