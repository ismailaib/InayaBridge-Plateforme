// src/lib/useChatSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react'
import { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

interface Message {
  senderId: string
  content: string
  roomId: string
  timestamp?: string
}

// A robust STOMP-over-SockJS hook that guarantees exactly one client per room,
// avoids effect churn from unstable handlers, and cleans up reliably.
export function useChatSocket(
  roomId: string,
  onMessageReceived: (msg: Message) => void
) {
  const clientRef = useRef<Client | null>(null)
  const subscriptionRef = useRef<StompSubscription | null>(null)
  const handlerRef = useRef(onMessageReceived)
  const mountedRef = useRef(true)
  const [connected, setConnected] = useState(false)

  // Keep the latest message handler without forcing a reconnection.
  useEffect(() => {
    handlerRef.current = onMessageReceived
  }, [onMessageReceived])

  // Track mount state
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Main WebSocket effect - only depends on roomId
  useEffect(() => {
    if (!roomId) return

    // Prevent duplicate connections
    if (clientRef.current?.connected) {
      // If already connected to the same room, don't reconnect
      return
    }

    // Clean up any existing client
    const cleanup = () => {
      try {
        subscriptionRef.current?.unsubscribe()
      } catch (e) {
        console.error('[STOMP] Unsubscribe error:', e)
      }
      subscriptionRef.current = null

      if (clientRef.current) {
        try {
          clientRef.current.deactivate()
        } catch (e) {
          console.error('[STOMP] Deactivate error:', e)
        }
        clientRef.current = null
      }

      if (mountedRef.current) {
        setConnected(false)
      }
    }

    // Clean up existing connection if any
    cleanup()

    // Message handler that uses the ref
    const handleMessage = (message: IMessage) => {
      try {
        const parsed = JSON.parse(message.body)
        if (mountedRef.current && handlerRef.current) {
          handlerRef.current(parsed)
        }
      } catch (e) {
        console.error('[STOMP] Invalid message payload', e)
      }
    }

    // Create a fresh SockJS + STOMP client for this room
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[STOMP]', msg)
        }
      },
      onConnect: () => {
        if (!mountedRef.current) {
          console.warn('[STOMP] Connected but component unmounted')
          return
        }
        
        console.log('[STOMP] Connected to room:', roomId)
        setConnected(true)
        
        try {
          // Unsubscribe from any previous subscription
          subscriptionRef.current?.unsubscribe()
          
          // Subscribe to the room topic
          subscriptionRef.current = client.subscribe(
            `/topic/chat/${roomId}`,
            handleMessage
          )
          console.log('[STOMP] Subscribed to /topic/chat/' + roomId)
        } catch (e) {
          console.error('[STOMP] Subscription error:', e)
        }
      },
      onDisconnect: () => {
        if (!mountedRef.current) return
        console.log('[STOMP] Disconnected')
        setConnected(false)
      },
      onStompError: (frame) => {
        console.error('[STOMP] Broker error', frame.headers['message'], frame.body)
      },
      onWebSocketClose: (evt) => {
        if (!mountedRef.current) return
        console.warn('[STOMP] WebSocket closed', evt?.code, evt?.reason)
        setConnected(false)
      },
      onWebSocketError: (evt) => {
        console.error('[STOMP] WebSocket error', evt)
      },
    })

    clientRef.current = client
    
    try {
      client.activate()
    } catch (e) {
      console.error('[STOMP] Activation error:', e)
      cleanup()
    }

    // Cleanup function
    return cleanup
  }, [roomId]) // Only depend on roomId

  const sendMessage = useCallback((msg: Message) => {
    const client = clientRef.current
    if (!client?.connected) {
      console.warn('[STOMP] Not connected; message dropped')
      return false
    }

    try {
      client.publish({
        destination: `/app/chat.send/${msg.roomId}`,
        body: JSON.stringify(msg),
      })
      return true
    } catch (e) {
      console.error('[STOMP] Send error:', e)
      return false
    }
  }, [])

  return { connected, sendMessage }
}