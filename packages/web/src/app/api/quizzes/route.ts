import { requireHost } from "@quoosh/web/lib/adminGuard"
import { auth } from "@quoosh/web/lib/auth"
import { prisma } from "@quoosh/web/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        creatorId: session.user.id,
      },
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error("[QUIZZES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { error, session } = await requireHost()
    if (error) return error

    const body = await req.json()
    const { title, subject } = body

    if (!title || !subject) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        subject,
        creatorId: session!.user!.id!,
      },
    })

    return NextResponse.json(quiz)
  } catch (error: any) {
    console.error("[QUIZZES_POST]", error)
    return new NextResponse(error.message || "Internal Error", { status: 500 })
  }
}
