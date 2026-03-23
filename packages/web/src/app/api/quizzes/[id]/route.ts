import { auth } from "@quoosh/web/lib/auth"
import { prisma } from "@quoosh/web/lib/db"
import { normalizeImageForStorage } from "@quoosh/web/utils/image"
import { NextResponse } from "next/server"
import { z } from "zod"

const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  image: z.string().optional().nullable(),
  answers: z.array(z.string()).min(2).max(4),
  solution: z.number().int().min(0).max(3),
  time: z.number().int().min(5).max(120).default(20),
  cooldown: z.number().int().min(0).max(30).default(5),
})

const patchSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  subject: z.string().min(1).max(100).optional(),
  questions: z.array(questionSchema).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id, creatorId: session.user.id },
      include: {
        questions: { orderBy: { order: "asc" } },
      },
    })

    if (!quiz) {
      return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.error("[QUIZ_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const quizOwner = await prisma.quiz.findUnique({
      where: { id, creatorId: session.user.id },
    })

    if (!quizOwner) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()

    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { title, subject, questions } = parsed.data

    // All updates in one atomic transaction
    await prisma.$transaction(async (tx: any) => {
      if (title || subject) {
        await tx.quiz.update({
          where: { id },
          data: {
            ...(title && { title }),
            ...(subject && { subject }),
          },
        })
      }

      if (questions !== undefined) {
        await tx.question.deleteMany({ where: { quizId: id } })
        if (questions.length > 0) {
          await tx.question.createMany({
            data: questions.map((q, index) => ({
              quizId: id,
              text: q.text,
              image: normalizeImageForStorage(q.image),
              answers: q.answers,
              solution: q.solution,
              time: q.time,
              cooldown: q.cooldown,
              order: index,
            })),
          })
        }
      }
    })

    // Return fresh quiz with all updated data
    const freshQuiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: "asc" } },
      },
    })

    return NextResponse.json(freshQuiz)
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") console.error("[QUIZ_PATCH]", error)
    return new NextResponse(error.message || "Internal Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const quizOwner = await prisma.quiz.findUnique({
      where: { id, creatorId: session.user.id },
    })

    if (!quizOwner) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const deletedQuiz = await prisma.quiz.delete({ where: { id } })

    return NextResponse.json(deletedQuiz)
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") console.error("[QUIZ_DELETE]", error)
    return new NextResponse(error.message || "Internal Error", { status: 500 })
  }
}
