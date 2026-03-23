import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  const host = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      suspended: true,
      createdAt: true,
      quizzes: {
        select: {
          id: true,
          title: true,
          subject: true,
          status: true,
          createdAt: true,
          _count: { select: { questions: true, sessions: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      sessions: {
        select: {
          id: true,
          inviteCode: true,
          startedAt: true,
          endedAt: true,
          terminated: true,
          _count: { select: { playerSessions: true } },
        },
        orderBy: { startedAt: "desc" },
        take: 20,
      },
      _count: { select: { quizzes: true, sessions: true } },
    },
  })

  if (!host) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json(host)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  const body = await req.json()
  const { suspended } = body

  const updated = await prisma.user.update({
    where: { id },
    data: { suspended: Boolean(suspended) },
    select: { id: true, suspended: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  // Manual cascade since QuizSession.hostId and Announcement.sentBy lack onDelete: Cascade
  // 1. Get all session IDs for this host
  const sessions = await prisma.quizSession.findMany({
    where: { hostId: id },
    select: { id: true },
  })
  const sessionIds = sessions.map((s) => s.id)

  if (sessionIds.length > 0) {
    // 2. Delete player answers (cascade target from quizSession)
    await prisma.playerAnswer.deleteMany({
      where: { sessionId: { in: sessionIds } },
    })
    // 3. Delete player sessions
    await prisma.playerSession.deleteMany({
      where: { sessionId: { in: sessionIds } },
    })
    // 4. Delete quiz sessions
    await prisma.quizSession.deleteMany({ where: { id: { in: sessionIds } } })
  }

  // 5. Delete announcements sent by this admin/host
  await prisma.announcement.deleteMany({ where: { sentBy: id } })

  // 6. Delete the user — Prisma cascades Quiz → Question → Report automatically
  await prisma.user.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
