import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

const DEFAULTS: Record<string, string> = {
  maxPlayersPerSession: "100",
  defaultQuestionTime: "20",
  defaultCooldown: "5",
  nicknameMinLength: "2",
  nicknameMaxLength: "20",
  scoringMultiplier: "1000",
  leaderboardSize: "10",
  maintenanceMode: "false",
  maintenanceMessage: "",
}

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const rows = await prisma.platformSetting.findMany()
  const settings: Record<string, string> = { ...DEFAULTS }
  for (const row of rows) settings[row.key] = row.value

  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  const body: Record<string, string> = await req.json()

  const upserts = Object.entries(body).map(([key, value]) =>
    prisma.platformSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    }),
  )

  await Promise.all(upserts)
  return NextResponse.json({ ok: true })
}
