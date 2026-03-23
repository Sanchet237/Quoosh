"use client"

import background from "@quoosh/web/assets/background.webp"
import Loader from "@quoosh/web/components/Loader"
import { useSocket } from "@quoosh/web/contexts/socketProvider"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { isConnected, connect } = useSocket()
  const pathname = usePathname()
  const isLanding = pathname === "/"

  useEffect(() => {
    if (!isConnected && !isLanding) {
      connect()
    }
  }, [connect, isConnected, isLanding])

  if (!isLanding && !isConnected) {
    return (
      <section className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:py-12">
        {/* Classroom background */}
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

        <Loader className="h-23" />
        <h2 className="mt-2 text-center text-xl font-bold text-white drop-shadow-lg sm:text-2xl md:text-3xl">
          Loading...
        </h2>
      </section>
    )
  }

  if (isLanding) {
    return <>{children}</>
  }

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:py-12">
      {/* Classroom background */}
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

      {children}
    </section>
  )
}

export default AuthLayout
