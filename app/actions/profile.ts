"use server";

import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/user-auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const userPayload = await getUser();

    if (!userPayload) {
        return { error: "Unauthorized", status: 401 };
    }
    const userId = userPayload.userId;

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const bio = formData.get("bio") as string;
    const location = formData.get("location") as string;
    const headline = formData.get("headline") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const websiteUrl = formData.get("websiteUrl") as string;
    const twitterUrl = formData.get("twitterUrl") as string;

    if (!name) {
        return { error: "Name is required", success: false };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                phone,
                bio,
                location,
                headline,
                linkedinUrl,
                websiteUrl,
                twitterUrl
            }
        });

        revalidatePath("/profile");
        return { message: "Profile updated successfully.", success: true };

    } catch (e) {
        console.error(e);
        return { error: "Failed to update profile", success: false };
    }
}

export async function updateUsername(formData: FormData) {
    const userPayload = await getUser();

    if (!userPayload) {
        return { error: "Unauthorized", success: false };
    }

    const username = formData.get("username") as string;

    if (!username || username.length < 3) {
        return { error: "Username must be at least 3 characters long", success: false };
    }

    // Regex check: letters, numbers, underscores, dashes only
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        return { error: "Username can only contain letters, numbers, underscores, and dashes.", success: false };
    }

    try {
        // Check uniqueness
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser && existingUser.id !== userPayload.userId) {
            return { error: "Username is already taken.", success: false };
        }

        await prisma.user.update({
            where: { id: userPayload.userId },
            data: { username }
        });

        revalidatePath("/profile");
        return { success: true };

    } catch (e) {
        console.error(e);
        return { error: "Failed to update username", success: false };
    }
}

export async function updatePhoneNumber(phone: string) {
    const userPayload = await getUser();

    if (!userPayload) {
        return { error: "Unauthorized", success: false };
    }

    // Basic phone validation - at least 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        return { error: "Please enter a valid phone number (at least 10 digits)", success: false };
    }

    try {
        await prisma.user.update({
            where: { id: userPayload.userId },
            data: { phone }
        });

        revalidatePath("/profile");
        return { success: true, message: "Phone number saved" };

    } catch (e) {
        console.error(e);
        return { error: "Failed to save phone number", success: false };
    }
}

export async function getPublicUserProfile(username: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                bio: true,
                headline: true,
                location: true,
                linkedinUrl: true,
                websiteUrl: true,
                twitterUrl: true,
                createdAt: true,
                registrations: {
                    where: { status: "ACTIVE" },
                    select: {
                        event: {
                            select: {
                                title: true,
                                slug: true,
                                date: true,
                                imageUrl: true,
                                mode: true,
                                location: true, // Only if public
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });

        return user;
    } catch (e) {
        console.error("Error fetching public profile:", e);
        return null;
    }
}
