"use client"

import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type QuizDetail = {
  id: string
  title: string
  subject: string
  status: string
  createdAt: string
  creator: { id: string; name: string; email: string }
  questions: {
    id: string
    text: string
    answers: string[]
    solution: number
    time: number
    order: number
  }[]
  _count: { sessions: number }
  reports: {
    id: string
    reason: string
    reportedBy: string
    status: string
    createdAt: string
  }[]
}

const statusClass = (s: string) =>
  s === "APPROVED"
    ? "bg-green-900/30 text-green-400"
    : s === "REJECTED"
      ? "bg-red-900/40 text-red-400"
      : "bg-yellow-900/30 text-yellow-400"

export default function QuizDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [quiz, setQuiz] = useState<QuizDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/quizzes/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setQuiz(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const updateStatus = async (status: string) => {
    await fetch(`/api/admin/quizzes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setQuiz((q) => (q ? { ...q, status } : q))
  }

  const deleteQuiz = async () => {
    if (!confirm("Delete this quiz permanently?")) return
    await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" })
    router.push("/admin/quizzes")
  }

  if (loading) return <div className="p-8 text-amber-200/40">Loading…</div>
  if (!quiz) return <div className="p-8 text-amber-400">Quiz not found.</div>

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <div className="flex items-start gap-4">
        <Link
          href="/admin/quizzes"
          className="mt-1 text-amber-400/70 transition hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black tracking-tighter text-white italic">
            {quiz.title}
          </h1>
          <p className="mt-0.5 text-sm text-amber-200/40">
            {quiz.subject} · by{" "}
            <Link
              href={`/admin/hosts/${quiz.creator.id}`}
              className="text-amber-300/70 transition hover:text-white"
            >
              {quiz.creator.name}
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(quiz.status)}`}
          >
            {quiz.status}
          </span>
          {quiz.status !== "APPROVED" && (
            <button
              onClick={() => updateStatus("APPROVED")}
              className="rounded-full bg-green-900/30 px-3 py-1 text-xs font-bold text-green-400 transition hover:bg-green-900/60"
            >
              Approve
            </button>
          )}
          {quiz.status !== "REJECTED" && (
            <button
              onClick={() => updateStatus("REJECTED")}
              className="rounded-full bg-yellow-900/30 px-3 py-1 text-xs font-bold text-yellow-400 transition hover:bg-yellow-900/60"
            >
              Reject
            </button>
          )}
          <button
            onClick={deleteQuiz}
            className="flex items-center gap-1 rounded-full bg-red-900/30 px-3 py-1 text-xs font-bold text-red-400 transition hover:bg-red-900/60"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Questions", value: quiz.questions.length },
          { label: "Sessions Played", value: quiz._count.sessions },
          { label: "Reports", value: quiz.reports.length },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-5"
          >
            <p className="mb-1 text-xs tracking-widest text-amber-200/40 uppercase">
              {s.label}
            </p>
            <p className="text-2xl font-black text-white italic">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Questions */}
      <div>
        <h2 className="mb-3 text-lg font-black text-white italic">Questions</h2>
        <div className="space-y-3">
          {quiz.questions.map((q, i) => (
            <div
              key={q.id}
              className="rounded-xl border border-[#f5a000]/20 bg-[#2a2500] p-4"
            >
              <p className="mb-2 text-sm font-bold text-white">
                Q{i + 1}: {q.text}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {q.answers.map((a, ai) => (
                  <div
                    key={ai}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      ai === q.solution
                        ? "border border-green-700/30 bg-green-900/30 text-green-300"
                        : "bg-amber-900/20 text-amber-200/50"
                    }`}
                  >
                    {a}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-amber-200/30">
                {q.time}s time limit
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reports */}
      {quiz.reports.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-black text-white italic">Reports</h2>
          <div className="space-y-2">
            {quiz.reports.map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-[#f5a000]/20 bg-[#2a2500] p-4"
              >
                <div>
                  <p className="text-sm text-white">{r.reason}</p>
                  <p className="mt-0.5 text-xs text-amber-200/40">
                    By {r.reportedBy} ·{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                    r.status === "OPEN"
                      ? "bg-yellow-900/30 text-yellow-400"
                      : r.status === "RESOLVED"
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
