import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const [
    totalHosts,
    totalQuizzes,
    totalSessions,
    activeSessions,
    totalPlayers,
    weeklySessionsRaw,
    monthlySessionsRaw,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "HOST" } }),
    prisma.quiz.count(),
    prisma.quizSession.count(),
    prisma.quizSession.count({ where: { endedAt: null, terminated: false } }),
    prisma.playerSession.count(),
    // Sessions per day for last 7 days
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT DATE_TRUNC('day', "startedAt") AS day, COUNT(*) AS count
      FROM "QuizSession"
      WHERE "startedAt" >= NOW() - INTERVAL '7 days'
      GROUP BY day ORDER BY day
    `,
    // Sessions per day for last 30 days
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT DATE_TRUNC('day', "startedAt") AS day, COUNT(*) AS count
      FROM "QuizSession"
      WHERE "startedAt" >= NOW() - INTERVAL '30 days'
      GROUP BY day ORDER BY day
    `,
  ])

  const avgPlayersPerSession =
    totalSessions > 0 ? (totalPlayers / totalSessions).toFixed(1) : "0"

  const serialize = (rows: { day: string; count: bigint }[]) =>
    rows.map((r) => ({ day: r.day, count: Number(r.count) }))

  return NextResponse.json({
    totalHosts,
    totalQuizzes,
    totalSessions,
    activeSessions,
    totalPlayers,
    avgPlayersPerSession,
    weeklyStats: serialize(weeklySessionsRaw),
    monthlyStats: serialize(monthlySessionsRaw),
  })
}
