'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChatStore, Message } from '@/store/ChatStore';

const UI = () => {
  const { messages, isLoading } = useChatStore();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="absolute hidden md:flex flex-col z-10 overflow-y-scroll max-w-md mx-auto border-r border-gray-300 h-full"
      style={{ width: '100%', padding: '30px', height: "90%" }}
    >
      <div
        ref={scrollRef}
        className="mb-4 space-y-3"
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] transform rounded-lg px-4 py-2 transition-all ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#f9fafb] text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span
                className={`mt-1 block text-xs ${
                  msg.sender === 'user' ? 'text-white' : 'text-gray-500'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-start"
          >
            <div
              className="max-w-[70%] transform rounded-lg px-4 py-2 transition-all bg-[#f9fafb] text-gray-900"
            >
              <p className="text-sm">I am thinking ...</p>
              <span
                className="mt-1 block text-xs text-gray-500"
              >
                {new Date().toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UI;