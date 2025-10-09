'use client'

import { ChatRoom, createOrGetPrivateRoom, getTenantRooms } from '@/api/chat'
import { getEmployees } from '@/api/employees'
import { Badge } from '@/components/Badge'
import { Input } from '@/components/Input'
import { motion } from 'framer-motion'
import { MessageSquareOff } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { showToast } from '../../dashboard/hooks/utils'

interface ContactProps {
  tenantId: string
  userId: string
  setSelectedRoom: (room: ChatRoom | null) => void
  unread?: Record<string, number>
}

export default function Contact({
  tenantId,
  userId,
  setSelectedRoom,
  unread = {},
}: ContactProps) {
  const [employees, setEmployees] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [roomMap, setRoomMap] = useState<Record<string, string>>({}) // contactId → roomId

  // 🧩 Load employees and existing rooms
  useEffect(() => {
    if (!tenantId) return
    setLoading(true)
    Promise.all([getEmployees(tenantId), getTenantRooms(tenantId)])
      .then(([empRes, roomRes]) => {
        const list = empRes.data.filter((e: any) => e.id !== userId)
        setEmployees(list)
        setFiltered(list)

        // Build a contactId → roomId map
        const privateRooms = roomRes.data.filter((r: ChatRoom) => r.type === 'PRIVATE')
        const mapping: Record<string, string> = {}
        privateRooms.forEach((room: ChatRoom) => {
          const partner = room.members.find((m) => m !== userId)
          if (partner) mapping[partner] = room.id
        })
        setRoomMap(mapping)
      })
      .catch(() =>
        showToast('error', 'Erreur', "Impossible de charger les collaborateurs.")
      )
      .finally(() => setLoading(false))
  }, [tenantId, userId])

  // 🔍 Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(employees)
      return
    }
    const q = search.toLowerCase()
    setFiltered(
      employees.filter(
        (e) =>
          `${e.firstName ?? ''} ${e.lastName ?? ''}`.toLowerCase().includes(q) ||
          (e.email ?? '').toLowerCase().includes(q)
      )
    )
  }, [search, employees])

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 4 },
      show: { opacity: 1, y: 0 },
    }),
    []
  )

  const handleStartChat = async (targetUserId: string) => {
    try {
      const res = await createOrGetPrivateRoom(tenantId, userId, targetUserId)
      const room = res.data
      setRoomMap((prev) => ({ ...prev, [targetUserId]: room.id }))
      setSelectedRoom(room)
    } catch {
      showToast('error', 'Erreur', "Impossible de démarrer la conversation.")
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* 🔍 Search input */}
      <Input
        placeholder="Rechercher un collègue..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        className="mb-3"
      />

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded-md bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 mt-10 gap-2">
          <MessageSquareOff className="w-6 h-6" />
          <p className="text-sm">Aucun collègue trouvé.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
          {filtered.map((emp) => {
            const roomId = roomMap[emp.id]
            const unreadCount = roomId ? unread[roomId] ?? 0 : 0

            return (
              <motion.button
                key={emp.id}
                layout
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={itemVariants}
                transition={{ duration: 0.15 }}
                onClick={() => handleStartChat(emp.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800 relative"
              >
                {/* Avatar */}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                  {emp.firstName?.[0] ?? '?'}
                </span>

                {/* Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                    {emp.firstName} {emp.lastName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {emp.email}
                  </span>
                </div>

                {/* Role Badge */}
                {emp.roleName && (
                  <Badge variant="neutral" className="ml-auto">
                    {emp.roleName}
                  </Badge>
                )}

                {/* 🔔 Unread badge */}
                {unreadCount > 0 && (
                  <span className="absolute right-3 top-3 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-blue-600 text-white shadow">
                    {unreadCount/2}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}
