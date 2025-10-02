"use client"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs"
import {
  Bolt,
  Calendar,
  Check,
  Clock,
  File,
  Heart,
  Image,
  Mic,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
  ThumbsUp,
  UserPlus,
  X
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslations } from "@/lib/i18n/useTranslations"
import { useTranslationsContext } from "@/lib/i18n/TranslationsProvider"
import { getDirection } from "@/lib/i18n/i18n"

interface Message {
  id: string
  sender: "user" | "assistant"
  text: string
  time: string
  status: "sent" | "delivered" | "read"
  isVoice?: boolean
  voiceDuration?: string
  attachment?: {
    type: AttachmentType
    name: string
    size: string
  }
  reactions?: { emoji: string, count: number }[]
}

type AttachmentType = "image" | "document" | "pdf"
type PatientStatus = "online" | "offline" | "away"
type LastSeenKey = "lastSeen.online" | "lastSeen.fiveMinutes" | "lastSeen.twoHours" | "lastSeen.yesterday"

interface Patient {
  id: number
  name: string
  initials: string
  lastSeen: string
  status: PatientStatus
  unreadCount?: number
}

interface PatientConfig {
  id: number
  name: string
  initials: string
  lastSeenKey: LastSeenKey
  status: PatientStatus
  unreadCount?: number
}

const PATIENTS_CONFIG: PatientConfig[] = [
  { id: 1, name: "Ismail Aitbouhmad", initials: "IA", lastSeenKey: "lastSeen.online", status: "online" },
  { id: 2, name: "Omar Toumi", initials: "OT", lastSeenKey: "lastSeen.fiveMinutes", status: "away", unreadCount: 3 },
  { id: 3, name: "Anas El maky", initials: "AE", lastSeenKey: "lastSeen.twoHours", status: "offline" },
  { id: 4, name: "Zineb Ennasiri", initials: "ZE", lastSeenKey: "lastSeen.yesterday", status: "offline" },
  { id: 5, name: "Emmanuel Nzobantou", initials: "EH", lastSeenKey: "lastSeen.online", status: "online", unreadCount: 1 },
]

const attachmentDetails: Record<AttachmentType, { name: string; size: string }> = {
  image: { name: "photo.jpg", size: "1.2 MB" },
  document: { name: "rapport.docx", size: "345 KB" },
  pdf: { name: "analyse.pdf", size: "2.8 MB" }
}

const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
const generateId = () => Math.random().toString(36).substring(2, 15)

export default function ChatPage() {
  const t = useTranslations("chat")
  const { locale } = useTranslationsContext()
  const dir = getDirection(locale)

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: generateId(),
      sender: "assistant",
      text: t("messages.assistantGreeting"),
      time: getTime(),
      status: "read"
    },
  ])
  const [input, setInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState<number>(PATIENTS_CONFIG[0]?.id ?? 0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false)

  const messageEndRef = useRef<HTMLDivElement>(null)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)

  const patients = useMemo<Patient[]>(() =>
    PATIENTS_CONFIG.map((patient) => ({
      ...patient,
      lastSeen: t(patient.lastSeenKey),
    })),
  [t])

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0]

  useEffect(() => {
    if (!selectedPatient && patients.length > 0) {
      setSelectedPatientId(patients[0].id)
    }
  }, [patients, selectedPatient])

  const filteredPatients = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    if (!query) return patients

    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(query)
    )
  }, [patients, searchQuery])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: generateId(),
      sender: "user",
      text: input,
      time: getTime(),
      status: "sent"
    }

    setMessages(prev => [...prev, newMessage])
    setInput("")

    setIsTyping(true)

    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
      ))
    }, 500)
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)

    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const handleStopRecording = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
    }

    const duration = formatRecordingTime(recordingTime)
    setIsRecording(false)

    const newMessage: Message = {
      id: generateId(),
      sender: "user",
      text: t("messages.voiceLabel"),
      time: getTime(),
      status: "sent",
      isVoice: true,
      voiceDuration: duration
    }

    setMessages(prev => [...prev, newMessage])

    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            sender: "assistant",
            text: t("messages.assistantVoiceReply"),
            time: getTime(),
            status: "read"
          }
        ])
      }, 1500)
    }, 1000)
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  const attachmentMenuLabels: Record<AttachmentType, string> = {
    image: t("attachments.image"),
    document: t("attachments.document"),
    pdf: t("attachments.pdf")
  }

  const attachmentTypeLabels: Record<AttachmentType, string> = {
    image: t("attachments.labels.image"),
    document: t("attachments.labels.document"),
    pdf: t("attachments.labels.pdf")
  }

  const handleAddAttachment = (type: AttachmentType) => {
    const newMessage: Message = {
      id: generateId(),
      sender: "user",
      text: t("messages.attachmentSent", { filename: attachmentDetails[type].name }),
      time: getTime(),
      status: "sent",
      attachment: {
        type,
        name: attachmentDetails[type].name,
        size: attachmentDetails[type].size
      }
    }

    setMessages(prev => [...prev, newMessage])
    setAttachmentMenuOpen(false)

    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [
          ...prev,
          {
            id: generateId(),
            sender: "assistant",
            text: t("messages.assistantAttachmentReply", { type: attachmentTypeLabels[type] }),
            time: getTime(),
            status: "read"
          }
        ])
      }, 1500)
    }, 1000)
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReactions = msg.reactions || []
        const existingReaction = existingReactions.find(r => r.emoji === emoji)

        let updatedReactions
        if (existingReaction) {
          updatedReactions = existingReactions.map(r =>
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          )
        } else {
          updatedReactions = [...existingReactions, { emoji, count: 1 }]
        }

        return { ...msg, reactions: updatedReactions }
      }
      return msg
    }))
  }

  if (!selectedPatient) {
    return null
  }

  const onlineLabel = t("statuses.online")

  return (
    <div dir={dir} className="flex h-[93vh] overflow-hidden p-4">
      <div className="w-80 m-4 mr-0 flex-shrink-0 flex flex-col overflow-hidden">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("header.title")}</h2>
            <Button variant="ghost">
              <Bolt className="w-4 h-4" />
            </Button>
          </div>
          <Divider />
          <div className="relative mx-1">
            <Input
              placeholder={t("header.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-2.5"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <Tabs defaultValue="chats" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="chats">{t("header.tabs.chats")}</TabsTrigger>
            <TabsTrigger value="appointments">{t("header.tabs.appointments")}</TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 overflow-y-auto p-2">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${selectedPatient.id === patient.id
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                onClick={() => setSelectedPatientId(patient.id)}
              >
                <div className="relative">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                    {patient.initials}
                  </div>
                  {patient.status === "online" && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {patient.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">12:45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {patient.status === "online" ? onlineLabel : patient.lastSeen}
                    </span>
                    {patient.unreadCount && (
                      <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {patient.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button className="flex items-center gap-2 px-3 py-2 mt-2 w-full rounded-lg text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              <UserPlus className="h-4 w-4" />
              <span>{t("list.addPatient")}</span>
            </button>
          </TabsContent>

          <TabsContent value="appointments" className="flex-1 overflow-y-auto p-4">
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-base font-medium text-gray-900 dark:text-gray-100">
                {t("appointments.emptyTitle")}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t("appointments.emptyDescription")}
              </p>
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                {t("appointments.new")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <main className="flex-1 flex flex-col m-4 overflow-hidden">
        <Card className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  {selectedPatient.initials}
                </div>
                {selectedPatient.status === "online" && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900"></div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedPatient.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedPatient.status === "online" ? onlineLabel : selectedPatient.lastSeen}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[75%] text-sm ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto [html[lang=ar]_&]:mr-0 items-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl relative group ${msg.sender === "user"
                    ? "bg-blue-100 text-blue-500 dark:bg-blue-500/20"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                    }`}
                >
                  {msg.isVoice ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center">
                        <Mic className="w-4 h-4 dark:text-gray-200" />
                      </div>
                      <div className="flex-1">
                        <div className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full">
                          <div className="h-full w-3/4 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <span className="dark:text-gray-200">{msg.voiceDuration}</span>
                    </div>
                  ) : msg.attachment ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-200 dark:bg-blue-700 flex items-center justify-center">
                        <File className="w-5 h-5 dark:text-gray-200" />
                      </div>
                      <div>
                        <p className="font-medium dark:text-gray-200">{msg.attachment.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{msg.attachment.size}</p>
                      </div>
                    </div>
                  ) : (
                    msg.text
                  )}

                  <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex bg-white dark:bg-gray-900 shadow-md rounded-full p-1">
                      <button
                        className="p-1 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full"
                        onClick={() => addReaction(msg.id, "👍")}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full"
                        onClick={() => addReaction(msg.id, "❤️")}
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-full"
                        onClick={() => addReaction(msg.id, "😊")}
                      >
                        <Smile className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {msg.reactions.map((reaction, idx) => (
                      <div key={idx} className="flex items-center bg-white dark:bg-gray-900 shadow-sm rounded-full px-1.5 py-0.5 text-xs">
                        <span className="dark:text-gray-300">{reaction.emoji}</span>
                        {reaction.count > 1 && <span className="ml-1">{reaction.count}</span>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{msg.time}</span>
                  {msg.sender === "user" && (
                    <span className="ml-1">
                      {msg.status === "read" ? (
                        <Check className="w-3.5 h-3.5 text-blue-500" />
                      ) : msg.status === "delivered" ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : null}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex max-w-[75%] mr-auto items-start">
                <div className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            {isRecording ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="flex-1">{t("recording.status")} {formatRecordingTime(recordingTime)}</div>
                <Button
                  variant="destructive"
                  onClick={handleStopRecording}
                >
                  {t("recording.stop")}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onMouseDown={handleStartRecording}>
                  <Mic className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </Button>

                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
                  >
                    <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </Button>

                  {attachmentMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                      <button
                        className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => handleAddAttachment("image")}
                      >
                        <Image className="w-4 h-4 text-blue-500" />
                        <span className="dark:text-gray-300">{attachmentMenuLabels.image}</span>
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => handleAddAttachment("document")}
                      >
                        <File className="w-4 h-4 text-blue-500" />
                        <span className="dark:text-gray-300">{attachmentMenuLabels.document}</span>
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => handleAddAttachment("pdf")}
                      >
                        <File className="w-4 h-4 text-red-500" />
                        <span className="dark:text-gray-300">{attachmentMenuLabels.pdf}</span>
                      </button>
                    </div>
                  )}
                </div>

                <Input
                  className="flex-1"
                  placeholder={t("input.placeholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}