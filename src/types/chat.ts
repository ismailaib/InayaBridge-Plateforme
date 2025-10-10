export type RoomType = "PRIVATE" | "CHANNEL"

export interface ChatRoom {
  id: string
  tenantId: string
  name: string
  type: RoomType
  members: string[]
  createdBy: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  content: string
  createdAt: string
}

export interface ChatMessagePayload {
  tenantId: string
  senderId: string
  content: string
  roomId: string
  timestamp?: string
}

export interface UserChatState {
  id: string
  tenantId: string
  roomId: string
  userId: string
  unreadCount: number
  lastReadAt?: string
  muted: boolean
  pinned: boolean
  lastNotifiedAt?: string
  createdAt: string
  updatedAt: string
}

export interface PresenceEvent {
  type: "ONLINE" | "OFFLINE" | "SNAPSHOT"
  userId?: string
  users?: string[]
}
