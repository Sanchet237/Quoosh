import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./db"
import { authRatelimit } from "./ratelimit"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
      
        // Rate limit by email
        if (authRatelimit) {
          const { success } = await authRatelimit.limit(
            credentials.email as string,
          )
          if (!success) return null
        }
      
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user) return null
        if (user.suspended) return null
        if (!user.password) return null
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        )
        if (passwordsMatch) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        }
        return null
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false
        try {
          const existingUser = await prisma.user.upsert({
            where: { email: user.email },
            update: { name: user.name ?? "Google User" },
            create: {
              email: user.email,
              name: user.name ?? "Google User",
              role: "HOST",
            },
          })
          if (existingUser.suspended) return false
          user.id = existingUser.id
          ;(user as any).role = existingUser.role
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Google sign-in DB error:", error)
          }
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role ?? "HOST"
      }
      if (account?.provider === "google" && !token.role) {
        token.role = "HOST"
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
  },
})