import { auth } from "@quoosh/web/lib/auth"
import { prisma } from "@quoosh/web/lib/db"
import fs from "fs"
import { NextResponse } from "next/server"
import path from "path"

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
        id: id,
        creatorId: session.user.id,
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    if (!quiz) {
      return new NextResponse("Not found or unauthorized", { status: 404 })
    }

    // Convert to Quoosh JSON format for the socket engine
    const quizzData = {
      subject: quiz.title,
      questions: quiz.questions.map((q) => ({
        question: q.text,
        answers: q.answers,
        image: q.image ?? undefined,
        solution: q.solution,
        time: q.time,
        cooldown: q.cooldown,
      })),
    }

    // Determine the config directory
    const configDir = path.resolve(process.cwd(), "../../config/quizz")

    // Ensure the directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }

    const filename = `_hosted_${quiz.id}`
    const filepath = path.join(configDir, `${filename}.json`)

    // Write the JSON file where the socket Config class expects it
    fs.writeFileSync(filepath, JSON.stringify(quizzData, null, 2))

    // Read the manager password from game config so the client can auto-auth
    const gameConfigPath = path.resolve(process.cwd(), "../../config/game.json")
    let managerPassword = ""
    try {
      const gameConfig = JSON.parse(fs.readFileSync(gameConfigPath, "utf-8"))
      managerPassword = gameConfig.managerPassword ?? ""
    } catch {
      // password stays empty — client will fail auth gracefully
    }

    return NextResponse.json({ filename, managerPassword })
  } catch (error: any) {
    console.error("[QUIZ_HOST]", error)
    return new NextResponse(error.message || "Internal Error", { status: 500 })
  }
}
