import { create } from "zustand"

interface PresenceState {
  onlineUsers: Set<string>
  setOnline: (id: string) => void
  setOffline: (id: string) => void
  replaceAll: (ids: string[]) => void
  isOnline: (id: string) => boolean
  splitByPresence: (ids: string[]) => {
    onlineIds: string[]
    offlineIds: string[]
  }
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUsers: new Set(),

  setOnline: (id) =>
    set((state) => {
      const next = new Set(state.onlineUsers)
      next.add(id)
      return { onlineUsers: next }
    }),

  setOffline: (id) =>
    set((state) => {
      const next = new Set(state.onlineUsers)
      next.delete(id)
      return { onlineUsers: next }
    }),

  replaceAll: (ids) => set({ onlineUsers: new Set(ids) }),

  isOnline: (id) => get().onlineUsers.has(id),

  splitByPresence: (ids) => {
    const onlineIds: string[] = []
    const offlineIds: string[] = []
    const online = get().onlineUsers
    ids.forEach((id) => (online.has(id) ? onlineIds.push(id) : offlineIds.push(id)))
    return { onlineIds, offlineIds }
  },
}))
