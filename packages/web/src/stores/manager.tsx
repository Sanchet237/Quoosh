import { Player } from "@quoosh/common/types/game"
import { STATUS, StatusDataMap } from "@quoosh/common/types/game/status"
import { createStatus, Status } from "@quoosh/web/utils/createStatus"
import { create } from "zustand"

type ManagerStore<T> = {
  gameId: string | null
  status: Status<T> | null
  players: Player[]

  setGameId: (_gameId: string | null) => void
  setStatus: <K extends keyof T>(_name: K, _data: T[K]) => void
  resetStatus: () => void
  setPlayers: (_players: Player[]) => void
  setLeaderboard: (_leaderboard: Player[]) => void

  reset: () => void
}

const initialState = {
  gameId: null,
  status: null,
  players: [],
}

export const useManagerStore = create<ManagerStore<StatusDataMap>>((set) => ({
  ...initialState,

  setGameId: (gameId) => set({ gameId }),

  setStatus: (name, data) => set({ status: createStatus(name, data) }),
  resetStatus: () => set({ status: null }),

  setPlayers: (players) => set({ players }),
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
