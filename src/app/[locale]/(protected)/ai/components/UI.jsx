"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import { useChatStore } from "@/store/ChatStore";
import { motion } from "framer-motion";
import { Check, Copy, MessageSquareOff } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import MessageContent from "./MessageContent";

const UI = () => {
  const { messages, isLoading } = useChatStore();
  const t = useTranslations("chat.chat.ui");
  const scrollRef = useRef(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const copyToClipboard = async (text, messageId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div
      className="absolute z-10 mx-auto hidden h-full max-w-md flex-col overflow-y-scroll md:flex dark:border-gray-800"
      style={{ width: "100%", padding: "30px", height: "90%" }}
    >
      <div ref={scrollRef} className="mb-4 space-y-3">
        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-2">
            <MessageSquareOff className="text-gray-500 dark:text-gray-200" />
            <span className="text-gray-500 dark:text-gray-200">
              {t("empty")}
            </span>
          </div>
        )}

        {/* Messages */}
        {/* {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`group relative max-w-[70%] transform cursor-pointer rounded-lg px-4 py-2 transition-all hover:shadow-md ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-[#f9fafb] text-gray-900 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              }`}
              onClick={() => copyToClipboard(msg.content, msg.id)}
            >
              <MessageContent
                content={msg.content}
                className="prose prose-neutral dark:prose-invert max-w-none"
              />

              <div
                className={`mt-1 flex items-center justify-between text-xs ${
                  msg.sender === "user" ? "text-white" : "text-gray-500"
                }`}
              >
                <span>
                  {new Date(msg.timestamp).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                <div
                  className={`opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                    msg.sender === "user"
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {copiedMessageId === msg.id ? (
                    <Check size={14} className="text-blue-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))} */}

        {/* Loader */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-start"
          >
            <div className="max-w-[70%] transform rounded-lg bg-[#f9fafb] px-4 py-2 text-gray-900 transition-all dark:bg-gray-900 dark:text-white">
              <p className="text-sm">{t("thinking")}</p>
              <span className="mt-1 block text-xs text-gray-500">
                {new Date().toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
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
