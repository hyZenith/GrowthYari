import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as string
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth
      if (account?.provider === "google" && profile) {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (existingUser) {
            // Prevent Admin from logging in via Google
            if (existingUser.role === "ADMIN") {
              return false
            }

            // Update googleId if not set
            if (!existingUser.googleId) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  googleId: account.providerAccountId,
                  image: user.image
                }
              })
            }
          } else {
            // Create new user with Google data
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "User",
                googleId: account.providerAccountId,
                image: user.image,
                role: "USER"
              }
            })
          }
        } catch (error) {
          console.error("Error in signIn callback:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Fetch the user from database to get the role
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role as string
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
})
