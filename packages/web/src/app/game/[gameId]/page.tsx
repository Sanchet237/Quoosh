"use client"

import { STATUS } from "@quoosh/common/types/game/status"
import GameWrapper from "@quoosh/web/components/game/GameWrapper"
import Answers from "@quoosh/web/components/game/states/Answers"
import Podium from "@quoosh/web/components/game/states/Podium"
import Prepared from "@quoosh/web/components/game/states/Prepared"
import Question from "@quoosh/web/components/game/states/Question"
import Result from "@quoosh/web/components/game/states/Result"
import Start from "@quoosh/web/components/game/states/Start"
import Wait from "@quoosh/web/components/game/states/Wait"
import { useEvent, useSocket } from "@quoosh/web/contexts/socketProvider"
import { usePlayerStore } from "@quoosh/web/stores/player"
import { useQuestionStore } from "@quoosh/web/stores/question"
import { GAME_STATE_COMPONENTS } from "@quoosh/web/utils/constants"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

const Game = () => {
  const router = useRouter()
  const { socket } = useSocket()
  const { gameId: gameIdParam }: { gameId?: string } = useParams()
  const { status, setPlayer, setGameId, setStatus, reset } = usePlayerStore()
  const { setQuestionStates } = useQuestionStore()

  useEvent("connect", () => {
    if (gameIdParam) {
      socket?.emit("player:reconnect", { gameId: gameIdParam })
    }
  })

  useEvent(
    "player:successReconnect",
    ({ gameId, status, player, currentQuestion }) => {
      setGameId(gameId)
      setStatus(status.name, status.data)
      setPlayer(player)
      setQuestionStates(currentQuestion)
    },
  )

  useEvent("game:status", ({ name, data }) => {
    if (name in GAME_STATE_COMPONENTS || name === STATUS.FINISHED) {
      setStatus(name, data)
    }
  })

  useEvent("game:reset", (message) => {
    router.replace("/play")
    reset()
    setQuestionStates(null)
    toast.error(message)
  })

  if (!gameIdParam) {
    router.replace("/play")
    return null
  }

  let component = null

  switch (status?.name) {
    case STATUS.WAIT:
      component = <Wait data={status.data} />

      break

    case STATUS.SHOW_START:
      component = <Start data={status.data} />

      break

    case STATUS.SHOW_PREPARED:
      component = <Prepared data={status.data} />

      break

    case STATUS.SHOW_QUESTION:
      component = <Question data={status.data} />

      break

    case STATUS.SHOW_RESULT:
      component = <Result data={status.data} />

      break

    case STATUS.SELECT_ANSWER:
      component = <Answers data={status.data} />

      break

    case STATUS.FINISHED:
      component = <Podium data={status.data} onGoHome={() => router.push("/")} />

      break
  }

  return <GameWrapper statusName={status?.name}>{component}</GameWrapper>
}

export default Game
