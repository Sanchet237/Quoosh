import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const sessionId = req.nextUrl.searchParams.get("sessionId") ?? ""
  const search = req.nextUrl.searchParams.get("search") ?? ""
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"))
  const limit = 30

  const where: any = {}
  if (sessionId) where.sessionId = sessionId
  if (search) where.nickname = { contains: search, mode: "insensitive" }

  const [players, total] = await Promise.all([
    prisma.playerSession.findMany({
      where,
      select: {
        id: true,
        nickname: true,
        avatar: true,
        score: true,
        joinedAt: true,
        session: {
          select: {
            id: true,
            inviteCode: true,
            quiz: { select: { title: true } },
          },
        },
        _count: { select: { answers: true } },
      },
      orderBy: { score: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.playerSession.count({ where }),
  ])

  return NextResponse.json({ players, total, page, limit })
}
