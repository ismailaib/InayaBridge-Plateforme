'use client'

import { ChatRoom } from '@/api/chat'
import { Card } from '@/components/Card'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import ChatSidebar from './components/ChatSidebar'
import ChatWindow from './components/ChatWindow'
import CreateChannelModal from './components/CreateChannelModal'

type UnreadMap = Record<string, number>

export default function ChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [tenantId, setTenantId] = useState('')
  const [userId, setUserId] = useState('')
  const [unread, setUnread] = useState<UnreadMap>({})
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const user = JSON.parse(stored)
      setUserId(user.id)
      setTenantId(user.doctorProfile?.tenantId ?? '')
    }
  }, [])

  useEffect(() => {
    if (!selectedRoom) return
    // Clear unread badge for active room
    setUnread((prev) => ({ ...prev, [selectedRoom.id]: 0 }))
  }, [selectedRoom])

  const sidebarVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -16 },
      show: { opacity: 1, x: 0 },
    }),
    []
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 grid grid-rows-[auto,1fr] gap-4 h-[82vh]">
      <div className='flex flex-row items-center justify-between'>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Messagerie
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vous pouvez gérer vos rendez-vous ici. Vous pouvez créer, modifier ou supprimer des rendez-vous selon vos besoins.
          </p>
        </div>
        <CreateChannelModal
          tenantId={tenantId}
          userId={userId}
          onCreated={(r) => setRooms([r, ...rooms])}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-0">
        <motion.div
          className="md:col-span-1 min-h-0"
          initial="hidden"
          animate="show"
          variants={sidebarVariants}
        >
          <Card className={`h-full p-4 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
            <ChatSidebar
              tenantId={tenantId}
              userId={userId}
              selectedRoom={selectedRoom}
              setSelectedRoom={(room) => {
                setSelectedRoom(room)
              }}
              setRooms={setRooms}
              rooms={rooms}
              unread={unread}
              setUnread={setUnread}
            />
          </Card>
        </motion.div>

        <Card className="md:col-span-3 p-0 overflow-hidden min-h-0">
          <ChatWindow
            room={selectedRoom}
            tenantId={tenantId}
            userId={userId}
            onNewMessageInOtherRoom={(roomId) =>
              setUnread((prev) => ({ ...prev, [roomId]: (prev[roomId] ?? 0) + 1 }))
            }
          />
        </Card>
      </div>
    </div>
  )
}
