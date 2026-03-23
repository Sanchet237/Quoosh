import { auth } from "@quoosh/web/lib/auth"
import { prisma } from "@quoosh/web/lib/db"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        id,
        creatorId: session.user.id,
      },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    })

    if (!quiz) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (!quiz.questions.length) {
      return new NextResponse("No questions in quiz", { status: 400 })
    }

    const quizData = {
      subject: quiz.title,
      questions: quiz.questions.map((q: any) => ({
        question: q.text,
        answers: q.answers,
        image: q.image ?? undefined,
      })),
    }

    // ✅ ADD THIS LINE
    const managerPassword = process.env.ADMIN_SOCKET_SECRET || ""

    return NextResponse.json({
      success: true,
      quiz: quizData,
      managerPassword, // 🔥 THIS FIXES YOUR ISSUE
    })
  } catch (error: any) {
    console.error("[QUIZ_HOST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
