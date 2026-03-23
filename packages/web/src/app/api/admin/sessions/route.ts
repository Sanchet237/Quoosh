import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"))
  const showActive = req.nextUrl.searchParams.get("active") === "true"
  const limit = 20

  const where = showActive ? { endedAt: null, terminated: false } : {}

  const [sessions, total] = await Promise.all([
    prisma.quizSession.findMany({
      where,
      select: {
        id: true,
        inviteCode: true,
        startedAt: true,
        endedAt: true,
        terminated: true,
        host: { select: { id: true, name: true, email: true } },
        quiz: { select: { id: true, title: true, subject: true } },
        _count: { select: { playerSessions: true } },
      },
      orderBy: { startedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.quizSession.count({ where }),
  ])

  return NextResponse.json({ sessions, total, page, limit })
}
