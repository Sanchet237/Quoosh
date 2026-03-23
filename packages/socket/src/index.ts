import { Server } from "@quoosh/common/types/game/socket"
import { inviteCodeValidator } from "@quoosh/common/validators/auth"
import env from "@quoosh/socket/env"
import Config from "@quoosh/socket/services/config"
import Game from "@quoosh/socket/services/game"
import Registry from "@quoosh/socket/services/registry"
import { withGame } from "@quoosh/socket/utils/game"
import { createServer } from "node:http"
import { Socket as RawSocket, Server as ServerIO } from "socket.io"

const isDev = process.env.NODE_ENV === "development"
const log = (...args: any[]) => { if (isDev) {console.log(...args)} }
const logError = (...args: any[]) => { if (isDev) {console.error(...args)} }

const httpServer = createServer()
const io: Server = new ServerIO(httpServer, {
  cors: {
    origin: [env.WEB_ORIGIN],
  },
})
Config.init()

const registry = Registry.getInstance()
const port = Number(env.SOCKET_PORT) || 3001

httpServer.listen(port, () => {
  log(`Socket server running on port ${port}`)
})

io.on("connection", (socket) => {
  log(`A user connected: socketId: ${socket.id}, clientId: ${socket.handshake.auth.clientId}`)

  socket.on("player:reconnect", ({ gameId }) => {
    const game = registry.getPlayerGame(gameId, socket.handshake.auth.clientId)

    if (game) {
      game.reconnect(socket)

      
return
    }

    socket.emit("game:reset", "Game not found")
  })

  socket.on("manager:reconnect", ({ gameId }) => {
    const game = registry.getManagerGame(gameId, socket.handshake.auth.clientId)

    if (game) {
      game.reconnect(socket)

      
return
    }

    socket.emit("game:reset", "Game expired")
  })

  socket.on("manager:auth", (password) => {
    try {
      const config = Config.game()

      if (password !== config.managerPassword) {
        socket.emit("manager:errorMessage", "Invalid password")

        
return
      }

      socket.emit("manager:quizzList", Config.quizz())
    } catch (error) {
      logError("Failed to read game config:", error)
      socket.emit("manager:errorMessage", "Failed to read game config")
    }
  })

  socket.on("game:create", (quizzId) => {
    const quizzList = Config.quizz()
    const quizz = quizzList.find((q) => q.id === quizzId)

    if (!quizz) {
      socket.emit("game:errorMessage", "Quizz not found")

      
return
    }

    const game = new Game(io, socket, quizz)
    registry.addGame(game)
  })

  socket.on("manager:hostDirect", ({ password, quizzId }) => {
    try {
      const config = Config.game()

      if (password !== config.managerPassword) {
        socket.emit("manager:errorMessage", "Invalid password")

        
return
      }

      const quizzList = Config.quizz()
      const quizz = quizzList.find((q) => q.id === quizzId)

      if (!quizz) {
        socket.emit("game:errorMessage", "Quizz not found")

        
return
      }

      const game = new Game(io, socket, quizz)
      registry.addGame(game)
    } catch (error) {
      logError("Failed to host direct:", error)
      socket.emit("manager:errorMessage", "Failed to create game")
    }
  })

  socket.on("player:join", (inviteCode) => {
    const result = inviteCodeValidator.safeParse(inviteCode)

    if (result.error) {
      socket.emit("game:errorMessage", result.error.issues[0].message)

      
return
    }

    const game = registry.getGameByInviteCode(inviteCode)

    if (!game) {
      socket.emit("game:errorMessage", "Game not found")

      
return
    }

    socket.emit("game:successRoom", game.gameId)
  })

  socket.on("player:login", ({ gameId, data }) =>
    withGame(gameId, socket, (game) => game.join(socket, data.username, data.avatar)),
  )

  socket.on("manager:kickPlayer", ({ gameId, playerId }) =>
    withGame(gameId, socket, (game) => game.kickPlayer(socket, playerId)),
  )

  socket.on("manager:startGame", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.start(socket)),
  )

  socket.on("player:selectedAnswer", ({ gameId, data }) =>
    withGame(gameId, socket, (game) => game.selectAnswer(socket, data.answerKey)),
  )

  socket.on("manager:abortQuiz", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.abortRound(socket)),
  )

  socket.on("manager:nextQuestion", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.nextRound(socket)),
  )

  socket.on("manager:showLeaderboard", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.showLeaderboard()),
  )

  socket.on("disconnect", () => {
    log(`A user disconnected : ${socket.id}`)

    const managerGame = registry.getGameByManagerSocketId(socket.id)

    if (managerGame) {
      managerGame.manager.connected = false
      registry.markGameAsEmpty(managerGame)

      if (!managerGame.started) {
        log("Reset game (manager disconnected)")
        managerGame.abortCooldown()
        io.to(managerGame.gameId).emit("game:reset", "Manager disconnected")
        registry.removeGame(managerGame.gameId)

        
return
      }
    }

    const game = registry.getGameByPlayerSocketId(socket.id)

    if (!game) {return}

    const player = game.players.find((p) => p.id === socket.id)

    if (!player) {return}

    if (!game.started) {
      game.players = game.players.filter((p) => p.id !== socket.id)
      io.to(game.manager.id).emit("manager:removePlayer", player.id)
      io.to(game.gameId).emit("game:totalPlayers", game.players.length)
      log(`Removed player ${player.username} from game ${game.gameId}`)

      
return
    }

    player.connected = false
    io.to(game.gameId).emit("game:totalPlayers", game.players.length)
  })
})

// ─── Admin namespace ──────────────────────────────────────────────────────────
const adminNs = (io as unknown as ServerIO).of("/admin")

adminNs.use((socket: RawSocket, next: (_err?: Error) => void) => {
  const secret = socket.handshake.auth?.secret

  if (secret !== env.ADMIN_SOCKET_SECRET) {
    return next(new Error("Unauthorized"))
  }

  return next()
})

const serializeGames = () =>
  registry.getAllGames().map((g) => ({
    gameId: g.gameId,
    inviteCode: g.inviteCode,
    subject: g.quizz.subject,
    totalQuestions: g.quizz.questions.length,
    currentQuestion: g.round?.currentQuestion ?? 0,
    playerCount: g.players.filter((p) => p.connected).length,
    started: g.started,
    status: g.lastBroadcastStatus?.name ?? "SHOW_ROOM",
  }))

adminNs.on("connection", (socket: RawSocket) => {
  log(`Admin connected: ${socket.id}`)
  socket.emit("admin:sessions", serializeGames())

  socket.on("admin:getSessions", () => {
    socket.emit("admin:sessions", serializeGames())
  })

  socket.on("admin:terminateSession", (gameId: string) => {
    const game = registry.getGameById(gameId)

    if (!game) {
      socket.emit("admin:error", `Game ${gameId} not found`)

      
return
    }

    io.to(game.gameId).emit("game:reset", "Session terminated by admin")
    registry.removeGame(gameId)
    adminNs.emit("admin:sessions", serializeGames())
    log(`Admin terminated game ${gameId}`)
  })

  socket.on("disconnect", () => {
    log(`Admin disconnected: ${socket.id}`)
  })
})

setInterval(() => {
  if (adminNs.sockets.size > 0) {
    adminNs.emit("admin:sessions", serializeGames())
  }
}, 5_000)

// ─── Process signals ──────────────────────────────────────────────────────────
process.on("SIGINT", () => {
  Registry.getInstance().cleanup()
  process.exit(0)
})

process.on("SIGTERM", () => {
  Registry.getInstance().cleanup()
  process.exit(0)
})