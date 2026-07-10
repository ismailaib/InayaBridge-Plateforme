'use client'

import { ChatMessage } from '@/api/chat'
import { cx } from '@/lib/utils'

interface Props {
  msg: ChatMessage & {
    senderName?: string
    senderEmail?: string
    senderRole?: string
  }
  userId: string
}

const senderColor = (id: string) => {
  const colors = ['bg-sky-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500']
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0
  return colors[Math.abs(hash) % colors.length]
}

const initials = (name?: string, fallback?: string) => {
  if (name) {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0]?.[0]?.toUpperCase() || '?'
  }
  return fallback?.slice(0, 2).toUpperCase() || '?'
}

export default function MessageBubble({ msg, userId }: Props) {
  const isMine = msg.senderId === userId
  const ts = new Date(msg.createdAt)

  return (
    <div className={cx('flex w-full gap-2', isMine ? 'justify-end' : 'justify-start')}>
      {/* ✅ Avatar (only for others) */}
      {!isMine && (
        <div className='flex flex-col items-end justify-end'>
          <div
            className={cx(
              'mt-1 h-8 w-8 flex items-center justify-center rounded-full text-[11px] text-white font-medium',
              senderColor(msg.senderId)
            )}
            title={msg.senderName || msg.senderEmail}
          >
            {initials(msg.senderName, msg.senderEmail)}
          </div>
        </div>

      )}

      {/* ✅ Message container */}
      <div
        className={cx(
          'max-w-[72%] px-3 py-2 rounded-2xl text-sm shadow-sm transition',
          isMine
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
        )}
      >
        {/* ✅ Sender info */}
        {!isMine && (
          <div className="mb-0.5">
            <div className="text-[12px] font-medium text-gray-700 dark:text-gray-300 leading-none">
              {msg.senderName ?? 'Utilisateur inconnu'}
            </div>
          </div>
        )}

        {/* ✅ Message text */}
        <div>{msg.content}</div>

        {/* ✅ Timestamp */}
        <div
          className={cx(
            'text-[10px] mt-1 text-right',
            isMine ? 'text-blue-200/80' : 'text-gray-400 dark:text-gray-500'
          )}
        >
          {ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
