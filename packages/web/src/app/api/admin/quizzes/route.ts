import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const search = req.nextUrl.searchParams.get("search") ?? ""
  const status = req.nextUrl.searchParams.get("status") ?? ""
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"))
  const limit = 20

  const where: any = {}
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
      { creator: { name: { contains: search, mode: "insensitive" } } },
    ]
  }
  if (status) where.status = status

  const [quizzes, total] = await Promise.all([
    prisma.quiz.findMany({
      where,
      select: {
        id: true,
        title: true,
        subject: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        creator: { select: { id: true, name: true, email: true } },
        _count: { select: { questions: true, sessions: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.quiz.count({ where }),
  ])

  return NextResponse.json({ quizzes, total, page, limit })
}
