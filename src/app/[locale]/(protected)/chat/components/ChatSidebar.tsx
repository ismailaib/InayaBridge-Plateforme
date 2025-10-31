'use client'

import { ChatRoom, getTenantRooms, sendMessage as sendMessageApi } from '@/api/chat'
import { getEmployees } from '@/api/employees'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs'
import { useChatSocket } from '@/lib/useChatSocket'
import { useChatStore } from '@/store/ChatStore'
import { MessageSquareText, MessagesSquare } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
}

export default function ChatSidebar({
  tenantId,
  userId,
  rooms,
  setRooms,
  selectedRoom,
  setSelectedRoom,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
  const incrementUnreadCount = useChatStore((s) => s.incrementUnreadCount)
  const states = useChatStore((s) => s.states)

  const { onlineUsers } = useChatSocket(selectedRoom?.id || '', userId, undefined)


  // 📡 Load rooms and employees
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

  useEffect(() => {
    const handler = (e: CustomEvent<{ roomId: string; senderId: string }>) => {
      const { roomId, senderId } = e.detail
      if (senderId === userId) return
      if (selectedRoom?.id === roomId) return

      incrementUnreadCount(tenantId, roomId, userId)

      const sender = employees.find((emp) => emp.id === senderId)
      const senderName =
        sender
          ? `${sender.firstName ?? ''} ${sender.lastName ?? ''}`.trim() ||
            sender.email
          : `Utilisateur ${senderId.slice(0, 6)}`

      showToast(
        'success',
        'Nouveau message',
        `Nouveau message de ${senderName}`
      )
    }

    window.addEventListener('chat:message', handler as EventListener)
    return () => window.removeEventListener('chat:message', handler as EventListener)
  }, [selectedRoom, userId, employees, incrementUnreadCount, tenantId])


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
              <div key={i} className="h-9 rounded-md bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        )}

        {!loading && rooms.length === 0 && (
          <div className="text-sm text-gray-500">Aucun salon pour le moment.</div>
        )}

        <div className="w-full mt-2">
          <Tabs defaultValue="contact">
            <TabsList className="w-full" variant="line">
              <TabsTrigger value="contact" className="flex items-center gap-2 w-full">
                <MessageSquareText width={18} /> Contacts
              </TabsTrigger>
              <TabsTrigger value="salon" className="flex items-center gap-2 w-full">
                <MessagesSquare width={18} /> Salons
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="contact">
                <Contact
                  tenantId={tenantId}
                  userId={userId}
                  setSelectedRoom={setSelectedRoom}
                  states={states}
                  onlineUsers={onlineUsers}
                />
              </TabsContent>
              <TabsContent value="salon">
                <Salon
                  rooms={rooms}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom}
                  itemVariants={itemVariants}
                  states={states}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
