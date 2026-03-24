"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Quiz = {
  id: string
  title: string
  subject: string
  status: string
  createdAt: string
  creator: { id: string; name: string; email: string }
  _count: { questions: number; sessions: number }
}

const STATUS_OPTIONS = ["", "APPROVED", "PENDING", "REJECTED"]

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchQuizzes = () => {
    setLoading(true)
    const params = new URLSearchParams({ search, status, page: String(page) })
    fetch(`/api/admin/quizzes?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setQuizzes(d.quizzes)
        setTotal(d.total)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchQuizzes()
  }, [search, status, page]) // eslint-disable-line

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/admin/quizzes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    fetchQuizzes()
  }

  const deleteQuiz = async (id: string) => {
    if (!confirm("Delete this quiz permanently?")) return
    await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" })
    fetchQuizzes()
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-white italic">
          Quiz Management
        </h1>
        <p className="mt-1 text-sm text-amber-200/40">{total} quizzes total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-amber-400/50" />
          <input
            type="text"
            placeholder="Search title, subject, host…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-72 rounded-xl border border-[#f5a000]/20 bg-[#2a2500] py-2.5 pr-4 pl-9 text-sm text-white placeholder-amber-200/30 focus:border-amber-500/60 focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="rounded-xl border border-[#f5a000]/20 bg-[#2a2500] px-4 py-2.5 text-sm text-white focus:border-amber-500/60 focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s || "All Statuses"}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#f5a000]/20 bg-[#2a2500]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#f5a000]/20 text-xs text-amber-200/50">
              {[
                "Title",
                "Subject",
                "Host",
                "Questions",
                "Sessions",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left font-bold tracking-wider uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-amber-200/30"
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && quizzes.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-amber-200/30"
                >
                  No quizzes found.
                </td>
              </tr>
            )}
            {quizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className="border-t border-[#f5a000]/10 transition-colors hover:bg-amber-900/10"
              >
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/quizzes/${quiz.id}`}
                    className="font-bold text-white transition hover:text-amber-400"
                  >
                    {quiz.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-amber-200/60">{quiz.subject}</td>
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/hosts/${quiz.creator.id}`}
                    className="text-xs text-amber-300/70 transition hover:text-white"
                  >
                    {quiz.creator.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-amber-200/60">
                  {quiz._count.questions}
                </td>
                <td className="px-5 py-3 text-amber-200/60">
                  {quiz._count.sessions}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      quiz.status === "APPROVED"
                        ? "bg-green-900/30 text-green-400"
                        : quiz.status === "REJECTED"
                          ? "bg-red-900/40 text-red-400"
                          : "bg-yellow-900/30 text-yellow-400"
                    }`}
                  >
                    {quiz.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {quiz.status !== "APPROVED" && (
                      <button
                        onClick={() => updateStatus(quiz.id, "APPROVED")}
                        className="text-xs font-bold text-green-400/80 transition hover:text-green-300"
                      >
                        Approve
                      </button>
                    )}
                    {quiz.status !== "REJECTED" && (
                      <button
                        onClick={() => updateStatus(quiz.id, "REJECTED")}
                        className="text-xs font-bold text-yellow-400/80 transition hover:text-yellow-300"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => deleteQuiz(quiz.id)}
                      className="text-xs font-bold text-red-400/80 transition hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className="flex items-center gap-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg bg-amber-900/30 px-4 py-1.5 text-amber-200 transition hover:bg-amber-900/50 disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-amber-200/40">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg bg-amber-900/30 px-4 py-1.5 text-amber-200 transition hover:bg-amber-900/50 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
