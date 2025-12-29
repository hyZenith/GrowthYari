import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check if user has a password (OAuth users won't have one)
    if (!user.password) {
      return NextResponse.json(
        { message: "Please provide a password " },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      )
    }

    // 🔐 Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    )

    // 🍪 Set HTTP-only cookie
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    )

    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("LOGIN_ERROR:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
