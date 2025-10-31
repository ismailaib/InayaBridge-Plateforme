import { useEffect, useRef, useState } from "react"
import { Client, IMessage, StompSubscription } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { usePresenceStore } from "@/store/PresenceStore"
import { PresenceEvent } from "@/types/chat"

export function usePresenceSocket(currentUserId?: string) {
  const clientRef = useRef<Client | null>(null)
  const subRef = useRef<StompSubscription | null>(null)
  const setOnline = usePresenceStore((s) => s.setOnline)
  const setOffline = usePresenceStore((s) => s.setOffline)
  const replaceAll = usePresenceStore((s) => s.replaceAll)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 4000,
      onConnect: () => {
        setConnected(true)
        try { subRef.current?.unsubscribe() } catch {}
        subRef.current = client.subscribe("/topic/chat/global", (msg: IMessage) => {
          try {
            const payload: PresenceEvent = JSON.parse(msg.body)
            if (payload.type === "ONLINE" && payload.userId) setOnline(payload.userId)
            else if (payload.type === "OFFLINE" && payload.userId) setOffline(payload.userId)
            else if (payload.type === "SNAPSHOT" && payload.users) replaceAll(payload.users)
          } catch (e) {
            console.error("[Presence] invalid message", e)
          }
        })

        if (currentUserId) {
          client.publish({
            destination: "/app/presence",
            body: JSON.stringify({ type: "ONLINE", userId: currentUserId }),
          })
        }
      },
      onDisconnect: () => setConnected(false),
    })

    clientRef.current = client
    client.activate()

    const cleanup = () => {
      try { subRef.current?.unsubscribe() } catch {}
      subRef.current = null
      client.deactivate().catch(() => {})
    }
    window.addEventListener("beforeunload", cleanup)
    return () => {
      window.removeEventListener("beforeunload", cleanup)
      cleanup()
    }
  }, [currentUserId])

  return { connected }
}
