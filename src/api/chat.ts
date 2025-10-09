import api from "@/lib/api"

export interface ChatRoom {
  id: string
  tenantId: string
  name: string
  type: "PRIVATE" | "CHANNEL"
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

/* ========== ROOM APIs ========== */

// 🔹 Get all rooms a user belongs to
export const getUserRooms = (userId: string) =>
  api.get<ChatRoom[]>(`/chat/rooms/user/${userId}`)

// 🔹 Get all rooms in a tenant (channels, etc.)
export const getTenantRooms = (tenantId: string) =>
  api.get<ChatRoom[]>(`/chat/rooms/tenant/${tenantId}`)

// 🔹 Create or get a PRIVATE room between two users
export const createOrGetPrivateRoom = (
  tenantId: string,
  userA: string,
  userB: string
) =>
  api.post<ChatRoom>(
    `/chat/rooms/private?tenantId=${tenantId}&userA=${userA}&userB=${userB}`
  )

// 🔹 Create a CHANNEL (group)
export const createChannel = (
  tenantId: string,
  name: string,
  createdBy: string,
  members: string[]
) =>
  api.post<ChatRoom>(
    `/chat/rooms/channel?tenantId=${tenantId}&name=${name}&createdBy=${createdBy}`,
    members
  )

/* ========== MESSAGE APIs ========== */

// 🔹 Fetch all messages in a room
export const getMessages = (roomId: string) =>
  api.get<ChatMessage[]>(`/chat/messages?roomId=${roomId}`)

// 🔹 Send message to a room
export const sendMessage = (
  roomId: string,
  senderId: string,
  content: string
) =>
  api.post<ChatMessage>(`/chat/messages`, {
    roomId,
    senderId,
    content,
  })
