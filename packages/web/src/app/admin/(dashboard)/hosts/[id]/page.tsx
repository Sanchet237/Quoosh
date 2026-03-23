"use client"

import { ArrowLeft, Trash2, UserCheck, UserX } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type HostDetail = {
  id: string
  name: string
  email: string
  role: string
  suspended: boolean
  createdAt: string
  _count: { quizzes: number; sessions: number }
  quizzes: {
    id: string
    title: string
    subject: string
    status: string
    createdAt: string
    _count: { questions: number; sessions: number }
  }[]
  sessions: {
    id: string
    inviteCode: string
    startedAt: string
    endedAt: string | null
    terminated: boolean
    _count: { playerSessions: number }
  }[]
}

export default function HostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [host, setHost] = useState<HostDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/hosts/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setHost(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const toggleSuspend = async () => {
    if (!host) return
    await fetch(`/api/admin/hosts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suspended: !host.suspended }),
    })
    setHost((h) => (h ? { ...h, suspended: !h.suspended } : h))
  }

  const deleteHost = async () => {
    if (!host) return
    if (
      !confirm(
        `Permanently delete "${host.name}" and all their quizzes and sessions?`,
      )
    )
      return
    const res = await fetch(`/api/admin/hosts/${id}`, { method: "DELETE" })
    if (res.ok) router.push("/admin/hosts")
  }

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-amber-400" />
      </div>
    )
  if (!host) return <div className="p-8 text-amber-400">Host not found.</div>

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/hosts"
          className="text-amber-400/70 transition hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-black tracking-tighter text-white italic">
            {host.name}
          </h1>
          <p className="text-sm text-amber-200/40">{host.email}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={toggleSuspend}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold italic transition ${
              host.suspended
                ? "bg-green-900/30 text-green-400 hover:bg-green-900/60"
                : "bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/60"
            }`}
          >
            {host.suspended ? (
              <UserCheck className="h-4 w-4" />
            ) : (
              <UserX className="h-4 w-4" />
            )}
            {host.suspended ? "Restore" : "Suspend"}
          </button>
          <button
            onClick={deleteHost}
            className="flex items-center gap-2 rounded-xl border-2 border-amber-600 bg-amber-400 px-4 py-2 text-sm font-black text-black italic [box-shadow:3px_3px_rgb(217_119_6)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:[box-shadow:0px_0px_rgb(217_119_6)]"
          >
            <Trash2 className="h-4 w-4" />
            Delete Host
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Quizzes", value: host._count.quizzes },
          { label: "Sessions", value: host._count.sessions },
          { label: "Status", value: host.suspended ? "Suspended" : "Active" },
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

      {/* Quizzes */}
      <div>
        <h2 className="mb-3 text-lg font-black text-white italic">Quizzes</h2>
        <div className="overflow-hidden rounded-2xl border border-[#f5a000]/20 bg-[#2a2500]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f5a000]/20">
                {["Title", "Subject", "Questions", "Sessions", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-bold tracking-widest text-amber-200/40 uppercase"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {host.quizzes.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-xs text-amber-200/30"
                  >
                    No quizzes yet.
                  </td>
                </tr>
              )}
              {host.quizzes.map((q) => (
                <tr
                  key={q.id}
                  className="border-t border-[#f5a000]/10 transition hover:bg-amber-900/10"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/quizzes/${q.id}`}
                      className="font-semibold text-white transition hover:text-amber-400"
                    >
                      {q.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-amber-200/60">{q.subject}</td>
                  <td className="px-5 py-3 text-amber-200/60">
                    {q._count.questions}
                  </td>
                  <td className="px-5 py-3 text-amber-200/60">
                    {q._count.sessions}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        q.status === "APPROVED"
                          ? "bg-green-900/30 text-green-400"
                          : q.status === "REJECTED"
                            ? "bg-red-900/40 text-red-400"
                            : "bg-yellow-900/30 text-yellow-400"
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent sessions */}
      <div>
        <h2 className="mb-3 text-lg font-black text-white italic">
          Recent Sessions
        </h2>
        <div className="overflow-hidden rounded-2xl border border-[#f5a000]/20 bg-[#2a2500]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f5a000]/20">
                {["PIN", "Started", "Ended", "Players", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-bold tracking-widest text-amber-200/40 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {host.sessions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-xs text-amber-200/30"
                  >
                    No sessions yet.
                  </td>
                </tr>
              )}
              {host.sessions.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-[#f5a000]/10 transition hover:bg-amber-900/10"
                >
                  <td className="px-5 py-3 font-mono font-bold text-amber-300">
                    {s.inviteCode}
                  </td>
                  <td className="px-5 py-3 text-xs text-amber-200/60">
                    {new Date(s.startedAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-xs text-amber-200/60">
                    {s.endedAt ? new Date(s.endedAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-5 py-3 text-amber-200/60">
                    {s._count.playerSessions}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        s.terminated
                          ? "bg-red-900/40 text-red-400"
                          : !s.endedAt
                            ? "bg-green-900/30 text-green-400"
                            : "bg-amber-900/20 text-amber-200/40"
                      }`}
                    >
                      {s.terminated
                        ? "Terminated"
                        : !s.endedAt
                          ? "Live"
                          : "Completed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
