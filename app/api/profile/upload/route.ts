import { NextResponse } from "next/server";
import { getUser } from "@/lib/user-auth";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase-client";

export async function POST(request: Request) {
  try {
    const userPayload = await getUser();

    if (!userPayload) {
      return NextResponse.json(
        { error: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${userPayload.userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // Update user profile
    await prisma.user.update({
      where: { id: userPayload.userId },
      data: {
        image: publicUrl,
      },
    });

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Profile upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
