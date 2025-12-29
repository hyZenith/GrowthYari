import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    //find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user has a password (OAuth users won't have one)
    if (!user.password) {
      return NextResponse.json(
        { message: "Please use Google Sign-In for this account" },
        { status: 401 }
      );
    }

    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Ensure Admin (since this is Admin login)
    if (user.role == "ADMIN") {
      return NextResponse.json({ message: "Login to Admin Panel" }, { status: 403 });
    }

    // create JWT
     const token = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
     )

     const response = NextResponse.json(
        { message: "Login successful"},
        { status: 200}
     )

     response.cookies.set({
        name: "user_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
