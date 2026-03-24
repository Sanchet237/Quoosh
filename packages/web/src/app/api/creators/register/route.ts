import { prisma } from "@quoosh/web/lib/db"
import { registerRatelimit } from "@quoosh/web/lib/ratelimit"
import bcrypt from "bcryptjs"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    // Rate limiting
    if (registerRatelimit) {
      const headersList = await headers()
      const ip = headersList.get("x-forwarded-for") ?? "anonymous"
      const { success } = await registerRatelimit.limit(ip)
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        )
      }
    }

    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }
    if (process.env.NODE_ENV === "development") {
      console.error("Registration error:", error)
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}