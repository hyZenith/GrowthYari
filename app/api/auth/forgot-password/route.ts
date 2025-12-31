import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Check if user exists 
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return success even if user not found (User Enumeration Protection)
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
    }

    // 2. Clear any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email },
    });

    // 3. Generate Secure Token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // 4. Save Hashed Token to Database
    await prisma.passwordResetToken.create({
      data: {
        email,
        token: hashedToken,
        expiresAt,
      },
    });

    // 5. Send Email via Resend
    const appUrl = process.env.NEXTAUTH_URL;
    const resetUrl = `${appUrl}/auth/reset-password?token=${rawToken}&email=${email}`;

    const { data, error } = await resend.emails.send({
      from: 'GrowthYari <onboarding@resend.dev>', 
      to: email,
      subject: 'Reset your GrowthYari password',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #059669;">Reset Your Password</h1>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password for your GrowthYari account. Click the button below to proceed:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">GrowthYari - Empowering your professional growth.</p>
          <p style="font-size: 10px; color: #aaa;">Debug Info: Sent to ${email}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: "Failed to send email. Check server logs." }, { status: 500 });
    }

    console.log("Resend Email Sent Successfully:", data);

    return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
