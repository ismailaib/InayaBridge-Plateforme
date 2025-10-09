'use client'

import { ChatRoom, getTenantRooms } from '@/api/chat'
import { getEmployees } from '@/api/employees'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs'
import { Client } from '@stomp/stompjs'
import { MessageSquareText, MessagesSquare } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import SockJS from 'sockjs-client'
import { showToast } from '../../dashboard/hooks/utils'
import Contact from './Contact'
import { Salon } from './Salon'

interface Props {
  tenantId: string
  userId: string
  rooms: ChatRoom[]
  setRooms: (rooms: ChatRoom[]) => void
  selectedRoom: ChatRoom | null
  setSelectedRoom: (room: ChatRoom | null) => void
  unread: Record<string, number>
  setUnread: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >
}

export default function ChatSidebar({
  tenantId,
  userId,
  rooms,
  setRooms,
  selectedRoom,
  setSelectedRoom,
  unread,
  setUnread,
}: Props) {
  const clientRef = useRef<Client | null>(null)
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])

  // 🧩 Load tenant rooms + employees
  useEffect(() => {
    if (!tenantId) return
    setLoading(true)
    Promise.all([getTenantRooms(tenantId), getEmployees(tenantId)])
      .then(([roomRes, empRes]) => {
        setRooms(roomRes.data)
        setEmployees(empRes.data)
      })
      .catch(() =>
        showToast('error', 'Erreur', 'Impossible de charger les données du chat.')
      )
      .finally(() => setLoading(false))
  }, [tenantId, setRooms])

  // 🧠 Reset unread count when user opens a room
  useEffect(() => {
    if (!selectedRoom) return
    setUnread((prev) => {
      if (!prev[selectedRoom.id]) return prev
      const next = { ...prev }
      next[selectedRoom.id] = 0
      return next
    })
  }, [selectedRoom, setUnread])

  // 🔌 WebSocket setup for notifications
  useEffect(() => {
    if (clientRef.current) return
    const socket = new SockJS('http://localhost:8080/ws')
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/public', (frame) => {
          try {
            const msg = JSON.parse(frame.body)
            const roomId: string | undefined = msg?.roomId
            const senderId: string | undefined = msg?.senderId
            if (!roomId || !senderId || senderId === userId) return

            // 🚫 Don't count if user is viewing this room
            if (selectedRoom?.id === roomId) return

            // 🧮 Increase unread count
            setUnread((prev) => ({
              ...prev,
              [roomId]: (prev[roomId] ?? 0) + 1,
            }))

            // 💬 Show toast with sender info
            const sender = employees.find((e) => e.id === senderId)
            const senderName =
              sender
                ? `${sender.firstName ?? ''} ${sender.lastName ?? ''}`.trim() ||
                  sender.email
                : `Utilisateur ${senderId.slice(0, 6)}`
            const role = sender?.roleName ? ` (${sender.roleName})` : ''

            showToast(
              'success',
              'Nouveau message',
              `Nouveau message de <strong>${senderName}</strong>${role}`
            )
          } catch (err) {
            console.error('Erreur WebSocket :', err)
          }
        })
      },
    })

    clientRef.current = client
    client.activate()

    return () => {
      client.deactivate().catch(() => {})
      clientRef.current = null
    }
  }, [selectedRoom, setUnread, userId, employees])

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 6 },
      show: { opacity: 1, y: 0 },
    }),
    []
  )

  return (
    <div className="h-full flex flex-col">
      <div className="pr-1 w-full">
        {loading && (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-9 rounded-md bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        )}

        {!loading && rooms.length === 0 && (
          <div className="text-sm text-gray-500">
            Aucun salon pour le moment.
          </div>
        )}

        <div className="w-full mt-2">
          <Tabs defaultValue="contact">
            <TabsList className="w-full" variant="line">
              <TabsTrigger
                value="contact"
                className="flex flex-row items-center gap-2 w-full"
              >
                <MessageSquareText width={18} />
                Contacts
              </TabsTrigger>
              <TabsTrigger
                value="salon"
                className="flex flex-row items-center gap-2 w-full"
              >
                <MessagesSquare width={18} />
                Salons
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="contact">
                <Contact
                  tenantId={tenantId}
                  userId={userId}
                  setSelectedRoom={setSelectedRoom}
                  unread={unread}
                />
              </TabsContent>

              <TabsContent value="salon">
                <Salon
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                  unread={unread}
                  itemVariants={itemVariants}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
