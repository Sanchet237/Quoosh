import { prisma } from "@quoosh/web/lib/db"
import { NextResponse } from "next/server"

export async function GET(): Promise<NextResponse> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json(
      {
        status: "ok",
        db: "connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json(
      {
        status: "error",
        db: "disconnected",
      },
      { status: 503 },
    )
  }
}