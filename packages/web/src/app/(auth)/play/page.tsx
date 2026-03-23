"use client"

import Room from "@quoosh/web/components/game/join/Room"
import Username from "@quoosh/web/components/game/join/Username"
import { useEvent, useSocket } from "@quoosh/web/contexts/socketProvider"
import { usePlayerStore } from "@quoosh/web/stores/player"
import { useEffect } from "react"
import toast from "react-hot-toast"

const PlayPage = () => {
  const { isConnected, connect } = useSocket()
  const { player } = usePlayerStore()

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  useEvent("game:errorMessage", (message) => {
    toast.error(message)
  })

  if (player) {
    return <Username />
  }

  return <Room />
}

export default PlayPage
