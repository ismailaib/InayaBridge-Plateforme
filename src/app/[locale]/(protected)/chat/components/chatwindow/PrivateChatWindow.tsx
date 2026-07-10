'use client'

import { ChatMessage, ChatRoom, getMessages, sendMessage as sendMessageApi } from '@/api/chat'
import { getEmployees } from '@/api/employees'
import { Button } from '@/components/Button'
import { Client, StompSubscription } from '@stomp/stompjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SockJS from 'sockjs-client'
import { showToast } from '../../../dashboard/hooks/utils'
import MessageBubble from '../MessageBubble'
import EmptyChatPlaceholder from './EmptyChatPlaceholder'

export default function PrivateChatWindow({
  room,
  userId,
  tenantId,
  onNewMessageInOtherRoom,
}: {
  room: ChatRoom
  userId: string
  tenantId: string
  onNewMessageInOtherRoom?: (roomId: string) => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const clientRef = useRef<Client | null>(null)
  const textRef = useRef<HTMLTextAreaElement | null>(null)
  const roomSubscriptionRef = useRef<StompSubscription | null>(null)
  const presenceSubscriptionRef = useRef<StompSubscription | null>(null)

  const cleanupSubs = () => {
    try {
      roomSubscriptionRef.current?.unsubscribe()
    } catch {}
    roomSubscriptionRef.current = null
    try {
      presenceSubscriptionRef.current?.unsubscribe()
    } catch {}
    presenceSubscriptionRef.current = null
  }

  useEffect(() => {
    if (!tenantId) return
    setLoading(true)
    getEmployees(tenantId)
      .then((res) => setEmployees(res.data))
      .catch(() => showToast('error', 'Erreur', "Impossible de charger les collaborateurs."))
      .finally(() => setLoading(false))
  }, [tenantId])

  const scrollToBottom = useCallback(
    () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
    []
  )

  useEffect(() => {
    if (!room) return
    setLoading(true)
    getMessages(room.id)
      .then((res) => setMessages(res.data))
      .catch(() => showToast('error', 'Erreur', 'Impossible de charger les messages.'))
      .finally(() => setLoading(false))
  }, [room])

  useEffect(scrollToBottom, [messages, scrollToBottom])

  useEffect(() => {
    if (!room) return
    if (clientRef.current) {
      cleanupSubs()
      clientRef.current.deactivate().catch(() => {})
      clientRef.current = null
    }

    const socket = new SockJS('http://localhost:8080/ws')
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        // Ensure old subs are cleared before (re)subscribing
        cleanupSubs()
        roomSubscriptionRef.current = client.subscribe('/topic/public', (frame) => {
          try {
            const payload = JSON.parse(frame.body)
            if (!payload || !payload.roomId || !payload.content) return
            if (payload.roomId === room.id) {
              setMessages((prev) => {
                const exists = prev.some(
                  (m) =>
                    m.id === payload.id ||
                    (m.senderId === payload.senderId &&
                      m.content === payload.content &&
                      Math.abs(new Date(m.createdAt).getTime() - new Date(payload.createdAt).getTime()) < 2000)
                )
                if (exists) return prev
                return [...prev, payload]
              })
            } else if (payload.senderId !== userId) {
              onNewMessageInOtherRoom?.(payload.roomId)
            }
          } catch {}
        })

        presenceSubscriptionRef.current = client.subscribe('/topic/chat/global', (frame) => {
          try {
            const data = JSON.parse(frame.body)
            setOnlineUsers((prev) => {
              const next = new Set(prev)
              if (data.type === 'ONLINE') next.add(data.userId)
              else if (data.type === 'OFFLINE') next.delete(data.userId)
              return next
            })
          } catch {}
        })

        client.publish({
          destination: '/app/presence',
          body: JSON.stringify({ type: 'ONLINE', userId }),
        })
      },
      onDisconnect: () => {},
    })

    client.activate()
    clientRef.current = client
    return () => {
      cleanupSubs()
      client.deactivate().catch(() => {})
    }
  }, [room, userId, onNewMessageInOtherRoom])

  const handleSend = useCallback(async () => {
    const messageText = newMessage.trim()
    if (!messageText || !room) return

    const otherId = room.members?.find((m) => m !== userId)
    const otherOnline = otherId ? onlineUsers.has(otherId) : false

    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      roomId: room.id,
      senderId: userId,
      content: messageText,
      createdAt: new Date().toISOString(),
    }

    try {
      if (!otherOnline || !clientRef.current?.connected) {
        const { data: saved } = await sendMessageApi(tenantId, room.id, userId, messageText)
        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m.id === saved.id ||
              (m.senderId === saved.senderId &&
                m.content === saved.content &&
                Math.abs(new Date(m.createdAt).getTime() - new Date(saved.createdAt).getTime()) < 2000)
          )
          if (exists) return prev
          return [...prev, saved]
        })
      } else {
        clientRef.current.publish({
          destination: '/app/sendMessage',
          body: JSON.stringify({ ...msg, tenantId }),
        })
      }

      setNewMessage('')
      if (textRef.current) {
        textRef.current.style.height = '40px'
        textRef.current.focus()
      }
    } catch {
      showToast('error', 'Erreur', "Impossible d'envoyer le message.")
    }
  }, [newMessage, room, userId, tenantId, onlineUsers])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const otherMemberId = room.members?.find((m) => m !== userId)
  const other = employees.find((e) => e.id === otherMemberId)
  const isOtherOnline = otherMemberId ? onlineUsers.has(otherMemberId) : false

  const enrichedMessages = useMemo(() => {
    return messages.map((m) => {
      const sender = employees.find((e) => e.id === m.senderId)
      return {
        ...m,
        senderName: sender
          ? `${sender.firstName ?? ''} ${sender.lastName ?? ''}`.trim() || sender.email
          : 'Utilisateur inconnu',
        senderEmail: sender?.email ?? 'N/A',
        senderRole: sender?.roleName ?? '',
      }
    })
  }, [messages, employees])

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-200">
            {other?.firstName?.[0] ?? '?'}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              {`${other?.firstName ?? ''} ${other?.lastName ?? ''}`.trim() || other?.email}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {other?.email ?? ''} {other?.roleName ? `· ${other.roleName}` : ''}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-2 text-sm ${isOtherOnline ? 'text-green-500' : 'text-gray-400'}`}>
          <div className={`h-2.5 w-2.5 rounded-full ${isOtherOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          {isOtherOnline ? 'En ligne' : 'Hors ligne'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <></>
        ) : enrichedMessages.length === 0 ? (
          <EmptyChatPlaceholder variant="private" />
        ) : (
          enrichedMessages.map((msg) => (
            <MessageBubble key={msg.id + msg.createdAt} msg={msg} userId={userId} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-end border-t border-gray-200 dark:border-gray-800 p-3 gap-2 bg-white dark:bg-gray-950">
        <textarea
          ref={textRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 max-h-40 min-h-[40px] resize-none rounded-md border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Écrire un message… (Entrée pour envoyer)"
        />
        <Button onClick={handleSend} disabled={!newMessage.trim()}>
          Envoyer
        </Button>
      </div>
    </div>
  )
}
