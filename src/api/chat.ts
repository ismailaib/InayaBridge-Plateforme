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

export const getUserRooms = (userId: string) =>
  api.get<ChatRoom[]>(`/chat/rooms/user/${userId}`)

export const getTenantRooms = (tenantId: string) =>
  api.get<ChatRoom[]>(`/chat/rooms/tenant/${tenantId}`)

export const createOrGetPrivateRoom = (
  tenantId: string,
  userA: string,
  userB: string
) =>
  api.post<ChatRoom>(
    `/chat/rooms/private?tenantId=${tenantId}&userA=${userA}&userB=${userB}`
  )

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

export const getMessages = (roomId: string) =>
  api.get<ChatMessage[]>(`/chat/messages?roomId=${roomId}`)

/*  ✅ include tenantId in the payload */
export const sendMessage = (
  tenantId: string,
  roomId: string,
  senderId: string,
  content: string
) =>
  api.post<ChatMessage>(`/chat/messages`, {
    tenantId,
    roomId,
    senderId,
    content,
  })

export const getUserChatStates = (userId: string) =>
  api.get<UserChatState[]>(`/chat/state/${userId}`)

export const markRoomAsRead = (tenantId: string, roomId: string, userId: string) =>
  api.post(`/chat/state/read/${tenantId}/${roomId}/${userId}`)

export const updateRoomPreferences = (
  tenantId:string,
  userId: string,
  roomId: string,
  options: { pinned?: boolean; muted?: boolean }
) =>
  api.post(`/preferences/${tenantId}/${userId}/${roomId}`, null, {
    params: options,
  })

export const incrementUnreadCount = (tenantId:string,  roomId: string, userId: string) =>
  api.post(`/chat/state/increment-unread/${tenantId}/${roomId}/${userId}`)
