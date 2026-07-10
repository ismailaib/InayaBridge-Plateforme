'use client'

import { MessageSquare } from 'lucide-react'

interface Props {
  variant?: 'private' | 'group'
}

export default function EmptyChatPlaceholder({ variant = 'private' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 gap-3 py-10">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800">
        <MessageSquare className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Aucun message pour le moment
        </h3>
        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          {variant === 'private'
            ? "Soyez le premier à envoyer un message et à démarrer la conversation."
            : "Aucun message n’a encore été envoyé dans ce salon. Lancez la discussion !"}
        </p>
      </div>
    </div>
  )
}
