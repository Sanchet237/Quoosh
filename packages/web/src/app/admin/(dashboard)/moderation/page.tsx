"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type Report = {
  id: string
  reason: string
  reportedBy: string
  status: string
  createdAt: string
  adminNote: string | null
  quiz: { id: string; title: string; creator: { name: string } }
}

const STATUS_FILTERS = ["", "OPEN", "RESOLVED", "DISMISSED"]

export default function AdminModerationPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState("OPEN")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState<Record<string, string>>({})

  const fetchReports = () => {
    setLoading(true)
    const params = new URLSearchParams({ status, page: String(page) })
    fetch(`/api/admin/moderation?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setReports(d.reports)
        setTotal(d.total)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchReports()
  }, [status, page]) // eslint-disable-line

  const resolve = async (id: string, newStatus: string) => {
    await fetch("/api/admin/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: newStatus,
        adminNote: note[id] ?? "",
      }),
    })
    fetchReports()
  }

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-white italic">
          Content Moderation
        </h1>
        <p className="mt-1 text-sm text-amber-200/40">{total} reports</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatus(s)
              setPage(1)
            }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              status === s
                ? "border-2 border-amber-600 bg-amber-400 text-black"
                : "border border-[#f5a000]/20 bg-[#2a2500] text-amber-200/60 hover:text-white"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading && <p className="text-sm text-amber-200/30">Loading…</p>}
        {!loading && reports.length === 0 && (
          <div className="rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-10 text-center text-sm text-amber-200/30">
            No reports found.
          </div>
        )}
        {reports.map((r) => (
          <div
            key={r.id}
            className="space-y-3 rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-white">{r.reason}</p>
                <p className="mt-0.5 text-xs text-amber-200/40">
                  Reported by <strong>{r.reportedBy}</strong> ·{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-1 text-xs text-amber-200/60">
                  Quiz:{" "}
                  <Link
                    href={`/admin/quizzes/${r.quiz.id}`}
                    className="text-amber-300/80 transition hover:text-white"
                  >
                    {r.quiz.title}
                  </Link>{" "}
                  by {r.quiz.creator.name}
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

            {r.status === "OPEN" && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Admin note (optional)…"
                  value={note[r.id] ?? ""}
                  onChange={(e) =>
                    setNote((n) => ({ ...n, [r.id]: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#f5a000]/20 bg-black/30 px-4 py-2 text-sm text-white placeholder-amber-200/20 focus:border-amber-500/50 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => resolve(r.id, "RESOLVED")}
                    className="rounded-lg bg-green-900/30 px-4 py-1.5 text-xs font-bold text-green-400 transition hover:bg-green-900/60"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => resolve(r.id, "DISMISSED")}
                    className="rounded-lg bg-red-900/20 px-4 py-1.5 text-xs font-bold text-red-400/70 transition hover:bg-red-900/40"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {r.adminNote && (
              <p className="text-xs text-amber-200/40 italic">
                Note: {r.adminNote}
              </p>
            )}
          </div>
        ))}
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
