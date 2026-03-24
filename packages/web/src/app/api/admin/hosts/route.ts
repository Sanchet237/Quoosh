import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const search = req.nextUrl.searchParams.get("search") ?? ""
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"))
  const limit = 20

  const where = search
    ? {
        role: "HOST" as const,
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : { role: "HOST" as const }

  const [hosts, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        suspended: true,
        createdAt: true,
        _count: { select: { quizzes: true, sessions: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ hosts, total, page, limit })
}
