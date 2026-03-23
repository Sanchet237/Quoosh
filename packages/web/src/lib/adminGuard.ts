import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { requireAdmin } from "@quoosh/web/lib/adminGuard"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function DELETE(
  _req: NextRequest,
  { params }: Params
) {
  const { error } = await requireAdmin()
  if (error) return error

  const { id } = await params

  try {
    await prisma.announcement.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}