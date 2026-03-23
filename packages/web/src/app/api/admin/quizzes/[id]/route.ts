import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, email: true } },
      questions: { orderBy: { order: "asc" } },
      _count: { select: { sessions: true } },
      reports: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  })

  if (!quiz) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json(quiz)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  const body = await req.json()
  const { status, title, subject } = body

  const data: any = {}
  if (status) data.status = status
  if (title) data.title = title
  if (subject) data.subject = subject

  const updated = await prisma.quiz.update({
    where: { id },
    data,
    select: { id: true, status: true, title: true, subject: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  await prisma.quiz.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
