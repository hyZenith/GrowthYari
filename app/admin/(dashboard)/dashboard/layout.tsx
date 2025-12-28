// app/admin/dashboard/layout.tsx

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"
import type { ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

interface JwtPayload {
  userId: string
  role: "ADMIN" | "USER"
}

export default async function AdminDashboardLayout({
  children,
}: AdminLayoutProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_token")?.value

  if (!token) {
    redirect("/admin/login")
  }

  let payload: JwtPayload

  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload
  } catch {
    redirect("/admin/login")
  }

  if (payload.role !== "ADMIN") {
    redirect("/admin/login")
  }

  return (
    <section>
      {children}
    </section>
  )
}
