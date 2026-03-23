import { STATUS } from "@quoosh/common/types/game/status"
import { useSocket } from "@quoosh/web/contexts/socketProvider"
import { useManagerStore } from "@quoosh/web/stores/manager"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export type QuizProps = {
  id: string
  title: string
  subject: string
  questionCount: number
  index?: number
  onDelete: (id: string, title: string) => void
}

// Rich, editorial accent colours — chosen to pop on warm beige
const ACCENTS = [
  "#d97706", // golden yellow
  "#1f4e9e", // cobalt ink
  "#166534", // forest green
  "#b45309", // amber gold
  "#5b21b6", // deep violet
  "#0e7490", // ocean teal
]

// Shared button base
const BTN_BASE =
  "inline-flex items-center justify-center gap-1 py-1.5 px-2.5 font-black italic tracking-widest uppercase " +
  "rounded-lg text-xs border-2 select-none transition-all duration-100 " +
  "disabled:opacity-50 disabled:pointer-events-none"

// Per-button colour classes
const BTN_HOST =
  BTN_BASE +
  " bg-blue-500 text-white border-blue-700 " +
  "[box-shadow:3px_3px_0px_rgb(29_78_216)] " +
  "hover:translate-x-0.5 hover:translate-y-0.5 hover:[box-shadow:0px_0px_0px_rgb(29_78_216)]"

const BTN_EDIT =
  BTN_BASE +
  " bg-white text-green-700 border-green-400 " +
  "[box-shadow:3px_3px_0px_rgb(22_163_74)] " +
  "hover:translate-x-0.5 hover:translate-y-0.5 hover:[box-shadow:0px_0px_0px_rgb(22_163_74)]"

const BTN_DELETE =
  BTN_BASE +
  " bg-white text-red-600 border-red-400 " +
  "[box-shadow:3px_3px_0px_rgb(220_38_38)] " +
  "hover:translate-x-0.5 hover:translate-y-0.5 hover:[box-shadow:0px_0px_0px_rgb(220_38_38)]"

export default function QuizCard({
  id,
  title,
  subject,
  questionCount,
  index = 0,
  onDelete,
}: QuizProps) {
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const { setGameId, setStatus } = useManagerStore()
  const [isHosting, setIsHosting] = useState(false)
  const [hostError, setHostError] = useState<string | null>(null)

  const accent = ACCENTS[index % ACCENTS.length]

  const handleHost = async () => {
    setIsHosting(true)
    setHostError(null)
    try {
      if (!socket || !isConnected) {
        setHostError("Not connected to server")
        setIsHosting(false)
        return
      }

      // Listen BEFORE the fetch so we never miss the event
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
        setHostError(msg)
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

      // Fetch & emit in one pipeline
      const res = await fetch(`/api/quizzes/${id}/host`, { method: "POST" })
      if (!res.ok) {
        setHostError("Failed to prepare quiz")
        setIsHosting(false)
        cleanup()
        return
      }
      const { filename, managerPassword } = await res.json()

      socket.emit("manager:hostDirect", {
        password: managerPassword,
        quizzId: filename,
      })

      // Timeout — if server never responds, stop hanging
      timeoutId = setTimeout(() => {
        cleanup()
        setHostError("Server timed out — is the socket server running?")
        setIsHosting(false)
      }, 10_000)
    } catch (error) {
      console.error(error)
      setHostError("Unexpected error")
      setIsHosting(false)
    }
  }

  return (
    <div
      className="flex w-full overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "#f5efe0",
        boxShadow: "0 3px 16px rgba(0,0,0,0.4)",
        borderLeft: `5px solid ${accent}`,
      }}
    >
      {/* ── INFO SECTION ─────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col justify-center px-4 py-3">
        {/* TITLE */}
        <div
          className="flex items-baseline gap-2 py-1.5"
          style={{ borderBottom: "1px solid #ddd0b8" }}
        >
          <span
            className="w-12 shrink-0 text-[9px] font-black tracking-[0.25em] uppercase"
            style={{ color: accent }}
          >
            Title
          </span>
          <span
            className="text-[10px] font-black tracking-widest"
            style={{ color: accent }}
          >
            :
          </span>
          <h2
            className="truncate text-base leading-tight font-black tracking-tight uppercase"
            style={{ color: "#1a1007" }}
            title={title}
          >
            {title}
          </h2>
        </div>

        {/* SUBJECT */}
        <div
          className="flex items-baseline gap-2 py-1.5"
          style={{ borderBottom: "1px solid #ddd0b8" }}
        >
          <span
            className="w-12 shrink-0 text-[9px] font-black tracking-[0.25em] uppercase"
            style={{ color: accent }}
          >
            Subject
          </span>
          <span
            className="text-[10px] font-black tracking-widest"
            style={{ color: accent }}
          >
            :
          </span>
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "#3d2b1a" }}
          >
            {subject}
          </span>
        </div>

        {/* ID  ·  QUESTIONS */}
        <div className="flex items-baseline gap-1 py-1.5">
          <span
            className="text-[9px] font-black tracking-[0.25em] uppercase"
            style={{ color: accent }}
          >
            ID
          </span>
          <span
            className="text-[10px] font-black tracking-widest"
            style={{ color: accent }}
          >
            :
          </span>
          <div className="flex flex-1 items-center justify-between">
            <span
              className="font-mono text-[11px] font-bold tracking-widest uppercase"
              style={{ color: "#6b5540" }}
            >
              {id.slice(0, 8).toUpperCase()}
            </span>
            <span
              className="rounded-full px-3 py-0.5 text-[10px] font-black tracking-widest uppercase"
              style={{
                background: `${accent}18`,
                color: accent,
                border: `1px solid ${accent}55`,
              }}
            >
              {questionCount} {questionCount === 1 ? "Question" : "Questions"}
            </span>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ──────────────────────────────────────────────── */}
      <div
        className="my-3 w-px"
        style={{
          background:
            "repeating-linear-gradient(to bottom, #c4b89a 0px, #c4b89a 5px, transparent 5px, transparent 11px)",
        }}
      />

      {/* ── ACTIONS SECTION ──────────────────────────────────────── */}
      <div className="flex shrink-0 flex-col justify-center gap-2 px-3 py-3">
        <button onClick={handleHost} disabled={isHosting} className={BTN_HOST}>
          {isHosting ? "…" : "▶ HOST"}
        </button>
        {hostError && (
          <span className="max-w-[80px] text-center text-[9px] font-bold tracking-wide break-words text-red-600 uppercase">
            {hostError}
          </span>
        )}
        <Link href={`/dashboard/quizzes/${id}/edit`} className={BTN_EDIT}>
          {/* Green pen SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" />
          </svg>
          EDIT
        </Link>
        <button onClick={() => onDelete(id, title)} className={BTN_DELETE}>
          {/* Red dustbin SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
              clipRule="evenodd"
            />
          </svg>
          DELETE
        </button>
      </div>
    </div>
  )
}
