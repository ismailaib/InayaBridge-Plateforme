'use client'

import { ChatMessage, ChatRoom, getMessages } from '@/api/chat'
import { Button } from '@/components/Button'
import { Client } from '@stomp/stompjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import SockJS from 'sockjs-client'
import { showToast } from '../../../dashboard/hooks/utils'
import MessageBubble from '../MessageBubble'
import EmptyChatPlaceholder from './EmptyChatPlaceholder'

export default function GroupChatWindow({
  room,
  userId,
}: {
  room: ChatRoom
  userId: string
  tenantId: string
  onNewMessageInOtherRoom?: (roomId: string) => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const clientRef = useRef<Client | null>(null)
  const textRef = useRef<HTMLTextAreaElement | null>(null)

  // 📨 Load initial messages
  useEffect(() => {
    if (!room) return
    getMessages(room.id)
      .then((res) => setMessages(res.data))
      .catch(() => showToast('error', 'Erreur', 'Impossible de charger les messages.'))
  }, [room])

  // 🔄 Scroll to bottom when new messages come
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 🔌 WebSocket connection
  useEffect(() => {
    if (!room) return

    const socket = new SockJS('http://localhost:8080/ws')
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe('/topic/public', (frame) => {
          try {
            const payload = JSON.parse(frame.body)

            // Ignore malformed payloads
            if (!payload || !payload.roomId || !payload.content) return

            // 🔥 Only add messages for THIS room and avoid duplicates
            if (payload.roomId !== room.id) return

            setMessages((prev) => {
              // Check if message already exists (by id or by content+sender+timestamp)
              const alreadyExists = prev.some(
                (m) =>
                  m.id === payload.id ||
                  (m.senderId === payload.senderId &&
                    m.content === payload.content &&
                    Math.abs(new Date(m.createdAt).getTime() - new Date(payload.createdAt).getTime()) < 2000)
              )
              if (alreadyExists) return prev
              return [...prev, payload]
            })
          } catch (err) {
            console.error('WebSocket parse error', err)
          }
        })
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected')
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate().catch(() => {})
      clientRef.current = null
    }
  }, [room])

  // 📤 Send message via button or Enter
  const sendMessage = useCallback(() => {
    const messageText = newMessage.trim()
    if (!messageText || !room || !clientRef.current) return

    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, // More unique ID
      roomId: room.id,
      senderId: userId,
      content: messageText,
      createdAt: new Date().toISOString(),
    }

    try {
      // ✅ Send to server (don't add optimistically - let WebSocket handle it)
      clientRef.current.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(msg),
      })

      // Clear input immediately
      setNewMessage('')
      if (textRef.current) {
        textRef.current.style.height = '40px'
        textRef.current.focus() // Keep focus on input
      }
    } catch (err) {
      console.error('Send error:', err)
      showToast('error', 'Erreur', "Impossible d'envoyer le message.")
    }
  }, [newMessage, room, userId])

  // 🧠 Send with Enter (not Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 🏷️ Header */}
      <div className="flex-none border-b border-gray-200 dark:border-gray-800 p-4 font-semibold text-gray-800 dark:text-gray-100">
        {room.name || 'Salon'}
      </div>

      {/* 💬 Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <EmptyChatPlaceholder variant="group" />
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id + msg.createdAt} msg={msg} userId={userId} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 📝 Input */}
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
        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
          Envoyer
        </Button>
      </div>
    </div>
  )
}