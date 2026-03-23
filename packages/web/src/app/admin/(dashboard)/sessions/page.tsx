"use client"

import { MonitorX, RefreshCw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"

type LiveSession = {
  gameId: string
  inviteCode: string
  subject: string
  totalQuestions: number
  currentQuestion: number
  playerCount: number
  started: boolean
  status: string
}

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [connected, setConnected] = useState(false)
  const [dbSessions, setDbSessions] = useState<any[]>([])
  const [dbTotal, setDbTotal] = useState(0)
  const [dbPage, setDbPage] = useState(1)
  const [loadingDb, setLoadingDb] = useState(true)
  const socketRef = useRef<Socket | null>(null)

  // Connect to admin socket namespace
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL!
    // Must match socket server ADMIN_SOCKET_SECRET (see root .env.example)
    const secret =
      process.env.NEXT_PUBLIC_ADMIN_SOCKET_SECRET ?? "change-me-admin-secret"

    const socket = io(`${socketUrl}/admin`, {
      auth: { secret },
      reconnectionAttempts: 5,
    })

    socketRef.current = socket
    socket.on("connect", () => setConnected(true))
    socket.on("disconnect", () => setConnected(false))
    socket.on("admin:sessions", (data: LiveSession[]) => setSessions(data))

    return () => {
      socket.disconnect()
    }
  }, [])

  // Fetch DB sessions (historical)
  const fetchDbSessions = (p: number) => {
    setLoadingDb(true)
    fetch(`/api/admin/sessions?page=${p}`)
      .then((r) => r.json())
      .then((d) => {
        setDbSessions(d.sessions)
        setDbTotal(d.total)
        setLoadingDb(false)
      })
      .catch(() => setLoadingDb(false))
  }

  useEffect(() => {
    fetchDbSessions(dbPage)
  }, [dbPage])

  const terminateLive = (gameId: string) => {
    if (!confirm("Terminate this session?")) return
    socketRef.current?.emit("admin:terminateSession", gameId)
  }

  const terminateDb = async (id: string) => {
    if (!confirm("Terminate this session?")) return
    await fetch(`/api/admin/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "terminate" }),
    })
    fetchDbSessions(dbPage)
  }

  return (
    <div className="space-y-8 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white italic">
            Live Session Monitoring
          </h1>
          <p className="mt-1 text-sm text-amber-200/40">
            Real-time view of all active quiz sessions
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
            connected
              ? "bg-green-900/30 text-green-400"
              : "bg-amber-900/30 text-amber-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${connected ? "animate-pulse bg-green-400" : "bg-amber-400"}`}
          />
          {connected ? "Connected" : "Disconnected"}
        </div>
      </div>

      {/* Live sessions */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-white italic">
            Live Sessions{" "}
            <span className="text-base text-amber-400">
              ({sessions.length})
            </span>
          </h2>
          <button
            onClick={() => socketRef.current?.emit("admin:getSessions")}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400/70 transition hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-10 text-center text-sm text-amber-200/30">
            No active sessions right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {sessions.map((s) => (
              <div
                key={s.gameId}
                className="space-y-3 rounded-2xl border border-[#f5a000]/20 bg-[#2a2500] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-white">{s.subject}</p>
                    <p className="mt-0.5 text-xs text-amber-200/40">
                      PIN:{" "}
                      <span className="font-mono font-bold text-amber-300">
                        {s.inviteCode}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      s.started
                        ? "bg-green-900/30 text-green-400"
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}
                  >
                    {s.started ? "In Progress" : "Waiting"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-black/20 p-2">
                    <p className="text-xs text-amber-200/40">Players</p>
                    <p className="text-lg font-black text-white">
                      {s.playerCount}
                    </p>
                  </div>
                  <div className="rounded-xl bg-black/20 p-2">
                    <p className="text-xs text-amber-200/40">Question</p>
                    <p className="text-lg font-black text-white">
                      {s.currentQuestion + 1} / {s.totalQuestions}
                    </p>
                  </div>
                  <div className="rounded-xl bg-black/20 p-2">
                    <p className="text-xs text-amber-200/40">Status</p>
                    <p className="mt-1 truncate text-xs font-bold text-white">
                      {s.status.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => terminateLive(s.gameId)}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-400/70 transition hover:text-red-300"
                >
                  <MonitorX className="h-3.5 w-3.5" /> Terminate Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical sessions */}
      <div>
        <h2 className="mb-3 text-lg font-black text-white italic">
          Session History
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-[#f5a000]/20">
          <div className="overflow-hidden rounded-2xl bg-[#2a2500]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f5a000]/20 text-xs text-amber-200/50">
                  {[
                    "PIN",
                    "Quiz",
                    "Host",
                    "Players",
                    "Started",
                    "Status",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-5 py-3 text-left font-bold tracking-wider uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingDb && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-amber-200/30"
                    >
                      Loading…
                    </td>
                  </tr>
                )}
                {!loadingDb && dbSessions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-amber-200/30"
                    >
                      No sessions recorded yet.
                    </td>
                  </tr>
                )}
                {dbSessions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-[#f5a000]/10 transition-colors hover:bg-amber-900/10"
                  >
                    <td className="px-5 py-3 font-mono font-bold text-amber-300">
                      {s.inviteCode}
                    </td>
                    <td className="px-5 py-3 text-white">{s.quiz.title}</td>
                    <td className="px-5 py-3 text-amber-200/60">
                      {s.host.name}
                    </td>
                    <td className="px-5 py-3 text-amber-200/60">
                      {s._count.playerSessions}
                    </td>
                    <td className="px-5 py-3 text-xs text-amber-200/40">
                      {new Date(s.startedAt).toLocaleString()}
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
                    <td className="px-5 py-3">
                      {!s.endedAt && !s.terminated && (
                        <button
                          onClick={() => terminateDb(s.id)}
                          className="text-xs font-bold text-red-400/70 transition hover:text-red-300"
                        >
                          Terminate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {dbTotal > 20 && (
          <div className="mt-4 flex items-center gap-3 text-sm">
            <button
              disabled={dbPage === 1}
              onClick={() => setDbPage((p) => p - 1)}
              className="rounded-lg bg-amber-900/30 px-4 py-1.5 text-amber-200 transition hover:bg-amber-900/50 disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-amber-200/40">
              Page {dbPage} of {Math.ceil(dbTotal / 20)}
            </span>
            <button
              disabled={dbPage >= Math.ceil(dbTotal / 20)}
              onClick={() => setDbPage((p) => p + 1)}
              className="rounded-lg bg-amber-900/30 px-4 py-1.5 text-amber-200 transition hover:bg-amber-900/50 disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
