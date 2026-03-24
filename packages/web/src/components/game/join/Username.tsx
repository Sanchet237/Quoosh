"use client"

import { STATUS } from "@quoosh/common/types/game/status"
import Input from "@quoosh/web/components/Input"
import AvatarPicker from "@quoosh/web/components/game/join/AvatarPicker"
import { useEvent, useSocket } from "@quoosh/web/contexts/socketProvider"
import { usePlayerStore } from "@quoosh/web/stores/player"
import { AVATARS, AvatarKey } from "@quoosh/web/utils/avatars"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

const Username = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus } = usePlayerStore()
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarKey>(
    AVATARS[0].key,
  )

  const handleLogin = () => {
    if (!gameId || !username.trim()) return
    socket?.emit("player:login", {
      gameId,
      data: { username: username.trim(), avatar: selectedAvatar },
    })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") handleLogin()
  }

  useEvent("game:successJoin", (gameId) => {
    setStatus(STATUS.WAIT, { text: "Waiting for the players" })
    login(username.trim(), selectedAvatar)
    router.replace(`/game/${gameId}`)
  })

  return (
    <div
      className="z-10 flex w-full max-w-xs flex-col gap-3 rounded-2xl bg-white p-5 sm:max-w-md sm:gap-4 sm:p-6"
      style={{ boxShadow: "6px 6px 0px #d97706, 0 20px 60px rgba(0,0,0,0.25)" }}
    >
      <h2 className="text-center text-lg font-black tracking-tight text-gray-800 sm:text-xl">
        Pick a Username
      </h2>

      <Input
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Username here"
      />

      {/* Avatar Picker */}
      <AvatarPicker selected={selectedAvatar} onChange={setSelectedAvatar} />

      {/* Join button */}
      <button
        onClick={handleLogin}
        disabled={!username.trim()}
        className="w-full rounded-xl py-2.5 text-sm font-bold text-white transition-all duration-150 hover:brightness-110 active:translate-y-[3px] active:shadow-none disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          boxShadow: "0 5px 0px #92400e, 0 6px 16px rgba(245,158,11,0.35)",
        }}
      >
        Let&apos;s Go!
      </button>
    </div>
  )
}

export default Username
