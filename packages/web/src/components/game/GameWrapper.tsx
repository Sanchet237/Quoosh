"use client"

import { Status } from "@quoosh/common/types/game/status"
import background from "@quoosh/web/assets/background.webp"
import Button from "@quoosh/web/components/Button"
import Loader from "@quoosh/web/components/Loader"
import { useEvent, useSocket } from "@quoosh/web/contexts/socketProvider"
import { usePlayerStore } from "@quoosh/web/stores/player"
import { useQuestionStore } from "@quoosh/web/stores/question"
import { MANAGER_SKIP_BTN } from "@quoosh/web/utils/constants"
import clsx from "clsx"
import Image from "next/image"
import { PropsWithChildren, useEffect, useState } from "react"

type Props = PropsWithChildren & {
  statusName: Status | undefined
  onNext?: () => void
  manager?: boolean
}

const GameWrapper = ({ children, statusName, onNext, manager }: Props) => {
  const { isConnected } = useSocket()
  const { player } = usePlayerStore()
  const { questionStates, setQuestionStates } = useQuestionStore()
  const [isDisabled, setIsDisabled] = useState(false)
  const next = statusName ? MANAGER_SKIP_BTN[statusName] : null

  useEvent("game:updateQuestion", ({ current, total }) => {
    setQuestionStates({
      current,
      total,
    })
  })

  useEffect(() => {
    setIsDisabled(false)
  }, [statusName])

  const handleNext = () => {
    setIsDisabled(true)
    onNext?.()
  }

  return (
    <section className="relative flex min-h-dvh w-full flex-col justify-between">
      <div className="fixed top-0 left-0 -z-10 h-full w-full bg-orange-600">
        <Image
          className="pointer-events-none h-full w-full object-cover opacity-50"
          src={background}
          alt="background"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(15,23,42,0.55)" }}
        />
      </div>

      {!isConnected && !statusName ? (
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
          <Loader />
          <h1 className="text-4xl font-bold text-white">Connecting...</h1>
        </div>
      ) : (
        <>
          <div className="flex w-full justify-between p-3 sm:p-4">
            {questionStates && (
              <div className="shadow-inset flex items-center rounded-md bg-white p-1.5 px-3 text-base font-bold text-black sm:p-2 sm:px-4 sm:text-lg">
                {`${questionStates.current} / ${questionStates.total}`}
              </div>
            )}

            {manager && next && (
              <Button
                className={clsx(
                  "self-end bg-white px-3 text-base text-black! sm:px-4 sm:text-lg",
                  {
                    "pointer-events-none": isDisabled,
                  },
                )}
                onClick={handleNext}
              >
                {next}
              </Button>
            )}
          </div>

          {children}

          {!manager && (
            <div className="z-50 flex items-center justify-between bg-white px-4 py-3 font-bold">
              <p className="max-w-[60%] truncate text-base font-bold text-gray-800 sm:text-lg">
                {player?.username}
              </p>
              <div className="rounded-sm bg-gray-800 px-3 py-1.5 text-base font-bold text-white sm:text-lg">
                {player?.points}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default GameWrapper
