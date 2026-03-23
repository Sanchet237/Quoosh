"use client"

import { STATUS } from "@quoosh/common/types/game/status"
import bgImage from "@quoosh/web/assets/background.webp"
import { QuestionFormValues } from "@quoosh/web/components/quiz-builder/ManualTab"
import QuestionEditor from "@quoosh/web/components/quiz-builder/QuestionEditor"
import QuestionList, {
  QuestionData,
} from "@quoosh/web/components/quiz-builder/QuestionList"
import { useSocket } from "@quoosh/web/contexts/socketProvider"
import { useManagerStore } from "@quoosh/web/stores/manager"
import { List, Pencil, Play } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

type QuizData = {
  id: string
  title: string
  subject: string
  questions: (QuestionFormValues & { id: string; order: number })[]
}

export default function EditQuizPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const { setGameId, setStatus } = useManagerStore()

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [mobileTab, setMobileTab] = useState<"list" | "editor">("list")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Editor State
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isHosting, setIsHosting] = useState(false)

  const handleHost = async () => {
    setIsHosting(true)
    try {
      if (!socket || !isConnected) {
        console.error("Not connected to server")
        setIsHosting(false)
        return
      }

      // Attach listeners BEFORE fetch so nothing is missed
      let timeoutId: ReturnType<typeof setTimeout> | null = null
      const onGameCreated = ({
        gameId,
        inviteCode,
      }: {
        gameId: string
        inviteCode: string
      }) => {
        setGameId(gameId)
        setStatus(STATUS.SHOW_ROOM, {
          text: "Waiting for the players",
          inviteCode,
        })
        cleanup()
        router.push(`/game/manager/${gameId}`)
      }
      const onError = (msg: string) => {
        console.error("Host error:", msg)
        setIsHosting(false)
        cleanup()
      }
      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId)
        socket.off("manager:gameCreated", onGameCreated)
        socket.off("manager:errorMessage", onError)
      }
      socket.on("manager:gameCreated", onGameCreated)
      socket.on("manager:errorMessage", onError)

      const res = await fetch(`/api/quizzes/${id}/host`, { method: "POST" })
      if (!res.ok) {
        console.error("Failed to prepare quiz")
        setIsHosting(false)
        cleanup()
        return
      }
      const { filename, managerPassword } = await res.json()

      socket.emit("manager:hostDirect", {
        password: managerPassword,
        quizzId: filename,
      })

      // Timeout — bail out if socket server never responds
      timeoutId = setTimeout(() => {
        cleanup()
        console.error("Socket server timed out")
        setIsHosting(false)
      }, 10_000)
    } catch (error) {
      console.error(error)
      setIsHosting(false)
    }
  }

  // Fetch the quiz and questions
  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/quizzes/${id}`)
      if (!res.ok) throw new Error("Failed to load quiz data")
      const data = await res.json()
      setQuiz(data)
    } catch (err) {
      setError("Unable to load the quiz.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuiz()
  }, [id])

  // Automatically select the first question if none selected
  useEffect(() => {
    if (quiz?.questions.length && !activeQuestionId) {
      setActiveQuestionId(quiz.questions[0].id)
    }
  }, [quiz, activeQuestionId])

  const activeQuestion =
    quiz?.questions.find((q) => q.id === activeQuestionId) || null

  // Generalized method to PATCH the whole quiz to sync DB
  const syncToDatabase = useCallback(async (
    updatedQuestions: Omit<QuestionFormValues & { order: number }, "id">[],
  ) => {
    setIsSaving(true)
    try {
      // Remember which array index the user was editing
      const activeIdx = quiz?.questions?.findIndex(
        (q) => q.id === activeQuestionId,
      )

      await fetch(`/api/quizzes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: updatedQuestions }),
      })

      const res = await fetch(`/api/quizzes/${id}`)
      const data = await res.json()

      setQuiz(data)

      // Update the active ID to the new backend UUID generated for this index locus
      if (
        activeIdx !== undefined &&
        activeIdx >= 0 &&
        data.questions[activeIdx]
      ) {
        setActiveQuestionId(data.questions[activeIdx].id)
      }
    } catch (e) {
      console.error("Failed to sync", e)
    } finally {
      setIsSaving(false)
    }
  }, [id, quiz, activeQuestionId])

  const handleSaveManual = useCallback(async (data: QuestionFormValues) => {
    if (!quiz || !activeQuestionId) return

    // Update the specific question
    const newQuestions = quiz.questions.map((q) =>
      q.id === activeQuestionId ? { ...q, ...data } : q,
    )

    // Strip generated frontend IDs before sending to DB so it creates fresh ones
    // and just pass the order down.
    const payload = newQuestions.map((q, idx) => {
      const { id, ...rest } = q
      return { ...rest, order: idx }
    })

    await syncToDatabase(payload)
  }, [quiz, activeQuestionId, syncToDatabase])

  const handleAddBulk = async (newQs: QuestionFormValues[]) => {
    if (!quiz) return

    const existingPayload = quiz.questions.map((q, idx) => {
      const { id, ...rest } = q
      return { ...rest, order: idx }
    })

    const newPayload = newQs.map((q, idx) => ({
      ...q,
      order: existingPayload.length + idx,
    }))

    await syncToDatabase([...existingPayload, ...newPayload])
  }

  const handleAddBlank = async () => {
    if (!quiz) return
    const blankQ: QuestionFormValues = {
      text: "New Question",
      answers: ["Option 1", "Option 2"],
      solution: 0,
      time: 20,
      cooldown: 5,
    }
    await handleAddBulk([blankQ])
  }

  const handleDelete = async (targetId: string) => {
    if (!quiz) return
    if (!confirm("Are you sure you want to delete this question?")) return

    const remaining = quiz.questions.filter((q) => q.id !== targetId)
    const payload = remaining.map((q, idx) => {
      const { id, ...rest } = q
      return { ...rest, order: idx }
    })

    if (activeQuestionId === targetId) {
      setActiveQuestionId(null)
    }

    await syncToDatabase(payload)
  }

  const handleReorder = async (newOrder: QuestionData[]) => {
    if (!quiz) return
    // Match the new order array back to their full source question bodies
    const newQuestionsPayload = newOrder.map((orderedItem) => {
      const src = quiz.questions.find((q) => q.id === orderedItem.id)!
      const { id, ...rest } = src
      return { ...rest, order: orderedItem.order }
    })

    await syncToDatabase(newQuestionsPayload)
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="mx-auto w-full max-w-7xl p-8">
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-500">
          {error || "Quiz not found"}
        </div>
        <Link href="/dashboard" className="mt-4 inline-block text-purple-400">
          &larr; Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 z-0 bg-[#1a1800]/70" />

      {/* Mobile tab switcher */}
      <div className="relative z-10 flex shrink-0 border-b border-gray-200 bg-white/95 lg:hidden">
        <button
          onClick={() => setMobileTab("list")}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-colors ${
            mobileTab === "list"
              ? "border-b-2 border-amber-500 bg-amber-50 text-amber-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <List className="h-4 w-4" /> Questions
        </button>
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-bold transition-colors ${
            mobileTab === "editor"
              ? "border-b-2 border-amber-500 bg-amber-50 text-amber-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Pencil className="h-4 w-4" /> Editor
        </button>
      </div>

      {/* Desktop: side-by-side; Mobile: tab-switched */}
      <div className="relative z-10 flex flex-1 overflow-hidden lg:gap-12 lg:p-8">
        {/* LEFT: Question List */}
        <div
          className={`flex w-full flex-col overflow-hidden rounded-none border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md lg:flex lg:w-64 lg:shrink-0 lg:rounded-xl lg:border ${
            mobileTab === "list" ? "flex" : "hidden"
          } lg:flex`}
        >
          <QuestionList
            questions={quiz.questions.map((q) => ({
              id: q.id,
              text: q.text,
              order: q.order,
            }))}
            activeId={activeQuestionId}
            onQuestionSelect={(id) => {
              setActiveQuestionId(id)
              setMobileTab("editor")
            }}
            onAddBlank={handleAddBlank}
            onDelete={handleDelete}
            onReorder={handleReorder}
          />
        </div>

        {/* MIDDLE: Editor */}
        <div
          className={`flex min-w-0 flex-1 flex-col overflow-hidden rounded-none border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md lg:flex lg:max-w-4xl lg:rounded-xl lg:border ${
            mobileTab === "editor" ? "flex" : "hidden"
          } lg:flex`}
        >
          <div className="z-10 flex shrink-0 flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-semibold text-gray-500">
                  Title:
                </span>
                <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {quiz.title}
                </h1>
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-semibold text-gray-500">
                  Subject:
                </span>
                <p className="text-base font-medium text-gray-700">
                  {quiz.subject}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleHost}
                disabled={isHosting}
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md border-2 border-[#263381] bg-[#f6f7ff] px-3 font-bold text-blue-700 [box-shadow:4px_4px_rgb(38_51_129)] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:0px_0px_rgb(38_51_129)] disabled:opacity-50 sm:flex-none sm:px-5"
              >
                <Play className="h-4 w-4" />
                {isHosting ? "Hosting..." : "Host"}
              </button>
              <Link
                href="/dashboard"
                className="flex h-10 flex-1 items-center justify-center rounded-md border-2 border-red-700 bg-red-50 px-3 font-bold text-red-600 [box-shadow:4px_4px_rgb(185_28_28)] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:0px_0px_rgb(185_28_28)] sm:flex-none sm:px-5"
              >
                Close
              </Link>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <QuestionEditor
              key={activeQuestion?.id || "empty"}
              activeQuestion={activeQuestion}
              onSaveManual={handleSaveManual}
              onAddBulk={handleAddBulk}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
