/* eslint-disable no-empty-function */
"use client"

import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@quoosh/common/types/game/socket"
import ky from "ky"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client"
import { v7 as uuid } from "uuid"

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

interface SocketContextValue {
  socket: TypedSocket | null
  webUrl: string | null
  isConnected: boolean
  clientId: string
  connect: () => void
  disconnect: () => void
  reconnect: () => void
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  webUrl: null,
  isConnected: false,
  clientId: "",
  connect: () => {},
  disconnect: () => {},
  reconnect: () => {},
})

const isDev = process.env.NODE_ENV === "development"

const log = (...args: any[]) => {
  if (isDev) console.log(...args)
}

const logError = (...args: any[]) => {
  if (isDev) console.error(...args)
}

const getSocketServer = async () =>
  await ky.get("/env").json<{ webUrl: string; socketUrl: string }>()

const getClientId = (): string => {
  try {
    const stored = localStorage.getItem("client_id")
    if (stored) return stored
    const newId = uuid()
    localStorage.setItem("client_id", newId)
    return newId
  } catch {
    return uuid()
  }
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<TypedSocket | null>(null)
  const [webUrl, setWebUrl] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [clientId] = useState<string>(() => getClientId())
  const errorToastShown = useRef(false)

  useEffect(() => {
    if (socket) return

    let s: TypedSocket | null = null

    const initSocket = async () => {
      try {
        const { webUrl } = await getSocketServer()

        s = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
          autoConnect: false,
          auth: { clientId },
        })

        setWebUrl(webUrl)
        setSocket(s)

        s.on("connect", () => {
          setIsConnected(true)
          errorToastShown.current = false
          log("Socket connected")
        })

        s.on("disconnect", () => {
          setIsConnected(false)
          log("Socket disconnected")
        })

        s.on("connect_error", (err) => {
          logError("Connection error:", err.message)
          if (!errorToastShown.current) {
            toast.error("Connection lost. Trying to reconnect...", {
              id: "socket-error",
              duration: 5000,
            })
            errorToastShown.current = true
          }
        })
      } catch (error) {
        logError("Failed to initialize socket:", error)
        toast.error("Failed to connect to server. Please refresh the page.", {
          id: "socket-init-error",
          duration: 8000,
        })
      }
    }

    initSocket()

    // eslint-disable-next-line consistent-return
    return () => {
      s?.disconnect()
    }
  }, [clientId])

  const connect = useCallback(() => {
    if (socket && !socket.connected) {
      socket.connect()
    }
  }, [socket])

  const disconnect = useCallback(() => {
    if (socket && socket.connected) {
      socket.disconnect()
    }
  }, [socket])

  const reconnect = useCallback(() => {
    if (socket) {
      socket.disconnect()
      socket.connect()
    }
  }, [socket])

  return (
    <SocketContext.Provider
      value={{
        socket,
        webUrl,
        isConnected,
        clientId,
        connect,
        disconnect,
        reconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)

export const useEvent = <E extends keyof ServerToClientEvents>(
  event: E,
  callback: ServerToClientEvents[E],
) => {
  const { socket } = useSocket()
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!socket) return

    const stableCallback = (...args: any[]) =>
      (callbackRef.current as any)(...args)

    socket.on(event, stableCallback as any)

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off(event, stableCallback as any)
    }
  }, [socket, event])
}