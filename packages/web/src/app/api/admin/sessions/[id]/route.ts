import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  const session = await prisma.quizSession.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, name: true, email: true } },
      quiz: {
        include: { questions: { orderBy: { order: "asc" } } },
      },
      playerSessions: {
        orderBy: { score: "desc" },
        include: { answers: true },
      },
    },
  })

  if (!session) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json(session)
}

// Terminate a session
export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  const body = await req.json()
  const { action } = body // "terminate"

  if (action === "terminate") {
    const updated = await prisma.quizSession.update({
      where: { id },
      data: { terminated: true, endedAt: new Date() },
      select: { id: true, terminated: true },
    })
    return NextResponse.json(updated)
  }

  return new NextResponse("Unknown action", { status: 400 })
}
