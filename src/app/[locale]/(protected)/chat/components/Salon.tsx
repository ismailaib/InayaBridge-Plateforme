'use client'

import { ChatRoom } from '@/api/chat'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/Badge'
import { Input } from '@/components/Input'
import { MessageSquareOff } from 'lucide-react'
import { useMemo, useState } from 'react'

interface SalonProps {
  rooms: ChatRoom[]
  selectedRoom: ChatRoom | null
  setSelectedRoom: (room: ChatRoom | null) => void
  unread: Record<string, number>
  itemVariants: any
}

export function Salon({
  rooms,
  selectedRoom,
  setSelectedRoom,
  unread,
  itemVariants,
}: SalonProps) {
  const [search, setSearch] = useState('')

  // ✅ Filter only public (non-private) rooms
  const publicRooms = rooms.filter(
    (room) =>
      room.type !== 'PRIVATE' &&
      (room.name?.toLowerCase().includes(search.toLowerCase()) ?? true)
  )

  const itemAnim = useMemo(
    () => ({
      hidden: { opacity: 0, y: 4 },
      show: { opacity: 1, y: 0 },
    }),
    []
  )

  return (
    <div className="w-full h-full flex flex-col">
      {/* 🔍 Search input */}
      <Input
        placeholder="Rechercher un salon..."
        value={search}
        name="search"
        type="search"
        id="search"
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      {publicRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 mt-10 gap-2">
          <MessageSquareOff className="w-6 h-6" />
          <p className="text-sm">Aucun salon public trouvé.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          <AnimatePresence>
            {publicRooms.map((room) => {
              const active = selectedRoom?.id === room.id
              const count = unread[room.id] ?? 0

              return (
                <motion.button
                  key={room.id}
                  layout
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={itemAnim}
                  transition={{ duration: 0.15 }}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {/* Room name + type */}
                  <div className="flex items-center gap-2 truncate">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      #
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-medium truncate">
                        {room.name || 'Salon'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {room.createdBy ? `Créé par ${room.createdBy}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Unread badge */}
                  {count > 0 && (
                    <Badge variant="neutral" className="ml-auto">
                      {count}
                    </Badge>
                  )}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
