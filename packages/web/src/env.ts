import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const env = createEnv({
  server: {
    WEB_ORIGIN: z.string().default("http://localhost:3000"),
    SOCKET_URL: z.string(),
    CONTACT_EMAIL: z.string().email().optional(),
  },

  client: {
    NEXT_PUBLIC_SOCKET_URL: z.string(),
    NEXT_PUBLIC_ADMIN_SOCKET_SECRET: z.string().default(""),
  },

  runtimeEnv: {
    WEB_ORIGIN: process.env.WEB_ORIGIN,
    SOCKET_URL: process.env.SOCKET_URL,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_ADMIN_SOCKET_SECRET:
      process.env.NEXT_PUBLIC_ADMIN_SOCKET_SECRET,
  },
})

export default env
