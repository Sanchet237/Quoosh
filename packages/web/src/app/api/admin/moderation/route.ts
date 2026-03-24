import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const status = req.nextUrl.searchParams.get("status") ?? ""
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"))
  const limit = 20

  const where: any = {}
  if (status) where.status = status

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            creator: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.report.count({ where }),
  ])

  return NextResponse.json({ reports, total, page, limit })
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body = await req.json()
  const { id, status, adminNote } = body

  const updated = await prisma.report.update({
    where: { id },
    data: {
      status,
      adminNote,
      resolvedAt: status !== "OPEN" ? new Date() : null,
    },
    select: { id: true, status: true },
  })

  return NextResponse.json(updated)
}
