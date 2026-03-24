import { STATUS, StatusDataMap } from "@quoosh/common/types/game/status"
import { createStatus, Status } from "@quoosh/web/utils/createStatus"
import { create } from "zustand"
import { Player } from "@quoosh/common/types/game"

type PlayerState = {
  username?: string
  avatar?: string
  points?: number
}

type PlayerStore<T> = {
  gameId: string | null
  player: PlayerState | null
  status: Status<T> | null

  setGameId: (_gameId: string | null) => void

  setPlayer: (_state: PlayerState) => void
  login: (_username: string, _avatar?: string) => void
  join: (_gameId: string) => void
  updatePoints: (_points: number) => void

  setStatus: <K extends keyof T>(_name: K, _data: T[K]) => void
  setLeaderboard: (_leaderboard: Player[]) => void

  reset: () => void
}

const initialState = {
  gameId: null,
  player: null,
  status: null,
}

export const usePlayerStore = create<PlayerStore<StatusDataMap>>((set) => ({
  ...initialState,

  setGameId: (gameId) => set({ gameId }),

  setPlayer: (player: PlayerState) => set({ player }),
  login: (username, avatar) =>
    set((state) => ({
      player: { ...state.player, username, avatar },
    })),

  join: (gameId) => {
    set((state) => ({
      gameId,
      player: { ...state.player, points: 0 },
    }))
  },

  updatePoints: (points) =>
    set((state) => ({
      player: { ...state.player, points },
    })),

  setStatus: (name, data) => set({ status: createStatus(name, data) }),
  setLeaderboard: (leaderboard) =>
    set((state) => {
      if (state.status?.name === STATUS.SHOW_LEADERBOARD) {
        return {
          status: createStatus(STATUS.SHOW_LEADERBOARD, {
            ...state.status.data,
            leaderboard,
          }),
        }
      }

      return {}
    }),

  reset: () => set(initialState),
}))
