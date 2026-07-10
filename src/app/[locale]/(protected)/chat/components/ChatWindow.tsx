'use client'

import { ChatRoom } from '@/api/chat'
import GroupChatWindow from './chatwindow/GroupChatWindow'
import PrivateChatWindow from './chatwindow/PrivateChatWindow'
import { MessageSquareReply } from 'lucide-react'

export default function ChatWindow({
    room,
    userId,
    tenantId,
    onNewMessageInOtherRoom,
}: {
    room: ChatRoom | null
    userId: string
    tenantId: string
    onNewMessageInOtherRoom?: (roomId: string) => void
}) {
    if (!room)
        return (
            <div className="flex flex-col items-center gap-4 justify-center h-full text-gray-400">
                <MessageSquareReply width={128} height={128} strokeWidth={1}  className='opacity-50'/>
                Sélectionnez un salon ou un contact pour commencer à discuter
            </div>
        )

    if (room.type === 'PRIVATE') {
        return (
            <PrivateChatWindow
                room={room}
                userId={userId}
                tenantId={tenantId}
                onNewMessageInOtherRoom={onNewMessageInOtherRoom}
            />
        )
    }

    return (
        <GroupChatWindow
            room={room}
            userId={userId}
            tenantId={tenantId}
            onNewMessageInOtherRoom={onNewMessageInOtherRoom}
        />
    )
}
