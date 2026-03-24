import Button from "@quoosh/web/components/Button"
import Form from "@quoosh/web/components/Form"
import Input from "@quoosh/web/components/Input"
import { useEvent, useSocket } from "@quoosh/web/contexts/socketProvider"
import { usePlayerStore } from "@quoosh/web/stores/player"
import { useSearchParams } from "next/navigation"
import { KeyboardEvent, useEffect, useRef, useState } from "react"

const Room = () => {
  const { socket, isConnected } = useSocket()
  const { join } = usePlayerStore()
  const [invitation, setInvitation] = useState("")
  const searchParams = useSearchParams()
  const hasJoinedRef = useRef(false)

  const handleJoin = () => {
    socket?.emit("player:join", invitation)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleJoin()
    }
  }

  useEvent("game:successRoom", (gameId) => {
    join(gameId)
  })

  useEffect(() => {
    const pinCode = searchParams.get("pin")

    if (!isConnected || !pinCode || hasJoinedRef.current) {
      return
    }

    socket?.emit("player:join", pinCode)
    hasJoinedRef.current = true
  }, [searchParams, isConnected, socket])

  return (
    <Form>
      <h2 className="text-center text-lg font-black tracking-tight text-gray-800 sm:text-xl">
        Enter Game PIN
      </h2>
      <Input
        onChange={(e) => setInvitation(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="PIN Code here"
      />
      <Button onClick={handleJoin}>Join Game</Button>
    </Form>
  )
}

export default Room
