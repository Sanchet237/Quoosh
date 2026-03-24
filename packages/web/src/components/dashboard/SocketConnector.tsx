"use client"

import { useSocket } from "@quoosh/web/contexts/socketProvider"
import { useEffect } from "react"

/** Ensures the socket is connected while the dashboard is mounted. */
export function SocketConnector() {
  const { connect } = useSocket()

  useEffect(() => {
    connect()
  }, [connect])

  return null
}
