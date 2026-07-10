import create from "zustand"
import type { ChatRoom, ChatMessage, UserChatState } from "@/api/chat"
import {
  markRoomAsRead as apiMarkRoomAsRead,
  updateRoomPreferences as apiUpdateRoomPreferences,
  incrementUnreadCount as apiIncrementUnreadCount,
} from "@/api/chat"

type MessagesByRoom = Record<string, ChatMessage[]>
type StatesByRoom = Record<string, UserChatState>

export interface ChatStoreState {
  rooms: ChatRoom[]
  messages: MessagesByRoom
  states: StatesByRoom
  selectedRoom: ChatRoom | null

  setRooms: (rooms: ChatRoom[]) => void
  setSelectedRoom: (room: ChatRoom | null) => void

  setMessages: (roomId: string, messages: ChatMessage[]) => void
  appendMessage: (roomId: string, message: ChatMessage) => void

  setState: (roomId: string, state: UserChatState) => void
  updateUnreadCount: (tenantId:string ,roomId: string, count: number) => void

  /* ✅ order is (tenantId, roomId, userId) */
  incrementUnreadCount: (tenantId:string , roomId:string , userId: string) => void

  markRoomAsRead: (tenantId:string , roomId: string, userId: string) => Promise<void>
  toggleMute: (tenantId:string ,roomId: string, userId: string) => Promise<void>
  togglePin: (tenantId:string ,roomId: string, userId: string) => Promise<void>
}

export const useChatStore = create<ChatStoreState>()((set, get) => ({
  rooms: [],
  messages: {},
  states: {},
  selectedRoom: null,
  setRooms: (rooms) => set({ rooms }),

  setSelectedRoom: (room) => set({ selectedRoom: room }),

  setMessages: (roomId, msgs) =>
    set((state) => ({
      messages: { ...state.messages, [roomId]: msgs },
    })),

  appendMessage: (roomId, message) =>
    set((state) => {
      const roomMessages = state.messages[roomId] ?? []
      const nextMessages = { ...state.messages, [roomId]: [...roomMessages, message] }
      return { messages: nextMessages }
    }),

  setState: (roomId, stateForRoom) =>
    set((state) => ({
      states: { ...state.states, [roomId]: stateForRoom },
    })),

  /* ✅ keep order consistent and persist */
  incrementUnreadCount: (tenantId, roomId, userId) => {
    const state = get()
    const prev = state.states[roomId]

    set((currentState) => {
      const currentPrev = currentState.states[roomId]
      if (!currentPrev) {
        const newState: UserChatState = {
          id: `${roomId}:state:${userId}`,
          tenantId,
          roomId,
          userId,
          unreadCount: 1,
          muted: false,
          pinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        apiIncrementUnreadCount(tenantId, roomId, userId).catch(() => {})
        return {
          states: {
            ...currentState.states,
            [roomId]: newState,
          },
        }
      }

      const newCount = (currentPrev.unreadCount ?? 0) + 1
      return {
        states: {
          ...currentState.states,
          [roomId]: {
            ...currentPrev,
            unreadCount: newCount,
            updatedAt: new Date().toISOString(),
          },
        },
      }
    })

    if (prev) {
      apiIncrementUnreadCount(tenantId, roomId, userId).catch(() => {})
    }
  },

  updateUnreadCount: (tenantId, roomId, count) =>
    set((state) => {
      const prev = state.states[roomId]
      if (!prev) return state
      return {
        states: {
          ...state.states,
          [roomId]: { ...prev, unreadCount: count, updatedAt: new Date().toISOString() },
        },
      }
    }),

  markRoomAsRead: async (tenantId, roomId, userId) => {
    const prev = get().states[roomId]
    set((state) => {
      if (!state.states[roomId]) return state
      return {
        states: {
          ...state.states,
          [roomId]: {
            ...state.states[roomId],
            unreadCount: 0,
            lastReadAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      }
    })
    try {
      await apiMarkRoomAsRead(tenantId, roomId, userId)
    } catch (e) {
      set((state) => ({
        states: { ...state.states, [roomId]: prev ?? state.states[roomId] },
      }))
      throw e
    }
  },

  toggleMute: async (tenantId, roomId, userId) => {
    const prev = get().states[roomId]
    const nextMuted = !(prev?.muted ?? false)
    set((state) => ({
      states: {
        ...state.states,
        [roomId]: {
          ...state.states[roomId],
          muted: nextMuted,
          updatedAt: new Date().toISOString(),
        },
      },
    }))
    try {
      await apiUpdateRoomPreferences(tenantId, userId, roomId, { muted: nextMuted })
    } catch (e) {
      set((state) => ({
        states: { ...state.states, [roomId]: prev ?? state.states[roomId] },
      }))
      throw e
    }
  },

  togglePin: async (tenantId, roomId, userId) => {
    const prev = get().states[roomId]
    const nextPinned = !(prev?.pinned ?? false)
    set((state) => ({
      states: {
        ...state.states,
        [roomId]: {
          ...state.states[roomId],
          pinned: nextPinned,
          updatedAt: new Date().toISOString(),
        },
      },
    }))
    try {
      await apiUpdateRoomPreferences(tenantId, userId, roomId, { pinned: nextPinned })
    } catch (e) {
      set((state) => ({
        states: { ...state.states, [roomId]: prev ?? state.states[roomId] },
      }))
      throw e
    }
  },
}))
