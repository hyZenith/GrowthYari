import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LinkedIn from "next-auth/providers/linkedin"
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
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid profile email', // Ensure these scopes are enabled in your app
        },
      },
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
      // For Google/LinkedIn OAuth
      if ((account?.provider === "google" || account?.provider === "linkedin") && profile) {
        try {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (existingUser) {
            // Prevent Admin from logging in via Google/LinkedIn if they shouldn't (logic is fine)
            if (existingUser.role === "ADMIN") {
              // Allow admin to link? Maybe not for now. Original logic returned false.
              // We will keep original behavior:
              return false
            }

            // Update googleId if not set (for Google)
            if (account.provider === "google" && !existingUser.googleId) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  googleId: account.providerAccountId,
                  image: user.image || existingUser.image // Update image if not set or user wants new one? Best to keep existing if available or update if empty.
                }
              })
            }

            // Update linkedinId if not set (for LinkedIn)
            if (account.provider === "linkedin" && !existingUser.linkedinId) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  linkedinId: account.providerAccountId,
                  image: user.image || existingUser.image // Same logic
                }
              })
            }

          } else {
            // Create new user
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "User",
                googleId: account.provider === "google" ? account.providerAccountId : null,
                linkedinId: account.provider === "linkedin" ? account.providerAccountId : null,
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
