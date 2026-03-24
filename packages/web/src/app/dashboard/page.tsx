"use client"

import bgImage from "@quoosh/web/assets/background.webp"
import DeleteQuizDialog from "@quoosh/web/components/dashboard/DeleteQuizDialog"
import QuizCard from "@quoosh/web/components/dashboard/QuizCard"
import Link from "next/link"
import { useEffect, useState } from "react"

type Quiz = {
  id: string
  title: string
  subject: string
  _count: {
    questions: number
  }
}

export default function DashboardPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    id: string
    title: string
  }>({
    isOpen: false,
    id: "",
    title: "",
  })

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("/api/quizzes")
      if (!res.ok) throw new Error("Failed to load quizzes")
      const data = await res.json()
      setQuizzes(data)
    } catch (err) {
      setError("Unable to load your quizzes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div
      className="relative flex flex-1 flex-col p-4 sm:p-8"
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay specifically for the My Quizzes page */}
      <div className="absolute inset-0 z-0 bg-[#1a1800]/75" />

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="relative mb-10 flex w-full flex-col items-center justify-center gap-4">
          <div className="text-center">
            <h2 className="mb-2 text-4xl font-black tracking-tighter text-white italic drop-shadow-lg sm:text-5xl">
              My Quizzes
            </h2>
            <p className="text-base text-amber-200/80 italic drop-shadow-md sm:text-lg">
              Create, manage, and launch your interactive quiz sessions
            </p>
          </div>
          <Link
            href="/dashboard/quizzes/new"
            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-amber-600 bg-amber-400 px-6 text-base font-black text-black italic [box-shadow:4px_4px_rgb(217_119_6)] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:0px_0px_rgb(217_119_6)] sm:text-lg"
          >
            + Create New Quiz
          </Link>
        </div>

        {error && (
          <div className="mb-8 rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}

        {quizzes.length === 0 && !error ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/90 py-20 text-center shadow-2xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
            <p className="mb-4 text-lg font-bold text-gray-500 italic">
              You haven't created any quizzes yet.
            </p>
            <Link
              href="/dashboard/quizzes/new"
              className="text-xl font-black text-amber-600 italic hover:text-amber-500"
            >
              Create your first quiz &rarr;
            </Link>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {quizzes.map((quiz, i) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                subject={quiz.subject}
                questionCount={quiz._count.questions}
                index={i}
                onDelete={(id, title) =>
                  setDeleteDialog({ isOpen: true, id, title })
                }
              />
            ))}
          </div>
        )}

        <DeleteQuizDialog
          isOpen={deleteDialog.isOpen}
          quizId={deleteDialog.id}
          quizTitle={deleteDialog.title}
          onClose={() => setDeleteDialog({ isOpen: false, id: "", title: "" })}
          onDeleted={fetchQuizzes}
        />
      </div>
    </div>
  )
}
