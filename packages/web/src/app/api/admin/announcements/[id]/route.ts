import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { auth } from "@quoosh/web/lib/auth"
import { prisma } from "@quoosh/web/lib/db"
import { NextRequest, NextResponse } from "next/server"

type Params = { params: Promise<{ id: string }> }

export async function DELETE(
  _req: NextRequest,
  { params }: Params
): Promise<NextResponse> {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  if ((session.user as any).role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 })
  }

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