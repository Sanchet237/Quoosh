import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error

  const announcements = await prisma.announcement.findMany({
    include: { admin: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(announcements)
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAdmin()
  if (error) return error

  const body = await req.json()
  const { title, body: announcementBody } = body

  if (!title || !announcementBody) {
    return new NextResponse("Missing title or body", { status: 400 })
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      body: announcementBody,
      sentBy: session!.user!.id as string,
    },
  })

  return NextResponse.json(announcement, { status: 201 })
}
