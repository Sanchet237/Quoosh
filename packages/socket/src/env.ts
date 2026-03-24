import { createEnv } from "@t3-oss/env-core"
import { z } from "zod/v4"

const env = createEnv({
  server: {
    WEB_ORIGIN: z.string().optional().default("http://localhost:3000"),
    SOCKET_PORT: z.string().default("3001"),
    ADMIN_SOCKET_SECRET: z
      .string()
      .min(
        32,
        'ADMIN_SOCKET_SECRET must be at least 32 characters — generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
      ),
  },

  runtimeEnv: {
    WEB_ORIGIN: process.env.WEB_ORIGIN,
    SOCKET_PORT:
      process.env.SOCKET_PORT ?? process.env.SOCKER_PORT ?? "3001",
    ADMIN_SOCKET_SECRET: process.env.ADMIN_SOCKET_SECRET,
  },
})

export default env
