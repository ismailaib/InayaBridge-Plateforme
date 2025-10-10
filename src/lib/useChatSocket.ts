import { ChatMessage, sendMessage as sendMessageApi } from "@/api/chat";
import { ChatStoreState, useChatStore } from "@/store/ChatStore";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessagePayload {
  tenantId: string;
  senderId: string;
  content: string;
  roomId: string;
  timestamp?: string;
}

export function useChatSocket(
  roomId: string,
  userId?: string,
  receiverId?: string
) {
  const clientRef = useRef<Client | null>(null);
  const roomSubscriptionRef = useRef<StompSubscription | null>(null);
  const mountedRef = useRef(true);

  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const { appendMessage, incrementUnreadCount, selectedRoom } = useChatStore(
    (s: ChatStoreState) => ({
      appendMessage: s.appendMessage,
      incrementUnreadCount: s.incrementUnreadCount,
      selectedRoom: s.selectedRoom,
    })
  );

  const cleanupSubscriptions = () => {
    try {
      roomSubscriptionRef.current?.unsubscribe();
      console.log("[STOMP] Unsubscribed from room");
    } catch (e) {
      console.warn("[STOMP] Error while unsubscribing", e);
    }
    roomSubscriptionRef.current = null;
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanupSubscriptions();
      clientRef.current?.deactivate();
    };
  }, []);

  const handleMessage = (message: IMessage) => {
    try {
      const parsed = JSON.parse(message.body);

      // 📨 Chat message
      if (parsed.content) {
        if (parsed.roomId !== roomId) return;

        const chatMessage: ChatMessage = {
          id: parsed.id || `${roomId}:${Date.now()}`,
          roomId: parsed.roomId,
          senderId: parsed.senderId,
          content: parsed.content,
          createdAt: parsed.timestamp || new Date().toISOString(),
        };

        appendMessage(roomId, chatMessage);

        if (parsed.senderId !== userId && selectedRoom?.id !== roomId) {
          const isReceiverOnline = receiverId
            ? onlineUsers.has(receiverId)
            : false;
          if (!isReceiverOnline) {
            incrementUnreadCount(parsed.tenantId, roomId, userId);
          }
        }
      }

      // 👥 Presence event
      else if (parsed.type === "ONLINE" || parsed.type === "OFFLINE") {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          if (parsed.type === "ONLINE") next.add(parsed.userId);
          else next.delete(parsed.userId);
          return next;
        });
      }
    } catch (e) {
      console.error("[STOMP] Invalid message payload", e);
    }
  };

  /**
   * 🌐 Init WebSocket connection
   */
  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (msg) => {
        if (process.env.NODE_ENV !== "production") console.log(`[STOMP] ${msg}`);
      },
      onConnect: () => {
        console.log("[STOMP] Connected ✅");
        setConnected(true);

        // Global presence channel
        client.subscribe(`/topic/chat/global`, handleMessage);

        // Announce online
        client.publish({
          destination: "/app/presence",
          body: JSON.stringify({ type: "ONLINE", userId }),
        });

        // Subscribe to active room after reconnect
        if (roomId) {
          cleanupSubscriptions();
          roomSubscriptionRef.current = client.subscribe(
            `/topic/public`,
            handleMessage
          );
          console.log("[STOMP] Subscribed to room after reconnect:", roomId);
        }
      },
      onDisconnect: () => {
        console.log("[STOMP] Disconnected ❌");
        setConnected(false);
      },
      onWebSocketClose: () => {
        console.log("[STOMP] WebSocket closed 🛑");
        setConnected(false);
        cleanupSubscriptions();
        if (clientRef.current?.connected) {
          clientRef.current.publish({
            destination: "/app/presence",
            body: JSON.stringify({ type: "OFFLINE", userId }),
          });
        }
      },
      onStompError: (frame) => {
        console.error(
          `[STOMP] Broker error: ${frame.headers["message"]}`,
          frame.body
        );
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      cleanupSubscriptions();
      client.deactivate();
    };
  }, [userId]);

  /**
   * 📨 Subscribe when roomId changes
   */
  useEffect(() => {
    if (!connected || !roomId || !clientRef.current) return;
    console.log("[STOMP] Subscribing to new room", roomId);
    cleanupSubscriptions();
    roomSubscriptionRef.current = clientRef.current.subscribe(
      `/topic/public`,
      handleMessage
    );
  }, [roomId, connected]);

  /**
   * 👀 Force re-subscribe when receiver presence changes
   * This fixes the “needs to click the chat” bug
   */
  useEffect(() => {
    if (!connected || !roomId || !clientRef.current || !receiverId) return;
    console.log("[STOMP] Re-subscribing due to receiver presence change");
    cleanupSubscriptions();
    roomSubscriptionRef.current = clientRef.current.subscribe(
      `/topic/public`,
      handleMessage
    );
  }, [onlineUsers, connected, roomId, receiverId]);

  /**
   * 🚪 OFFLINE beacon on unload
   */
  useEffect(() => {
    if (!userId) return;
    const handler = () => {
      try {
        const data = new Blob([JSON.stringify({ userId })], {
          type: "application/json",
        });
        navigator.sendBeacon(
          "http://localhost:8080/api/presence/offline",
          data
        );
      } catch (e) {
        console.error("[Presence] Beacon failed", e);
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [userId]);

  /**
   * ✉️ Send message with WebSocket or REST fallback
   */
  const sendMessage = useCallback(
    async (msg: ChatMessagePayload) => {
      const client = clientRef.current;
      const receiverIsOnline = receiverId ? onlineUsers.has(receiverId) : false;

      // 🟡 Receiver offline → REST
      if (!receiverId || !receiverIsOnline || !client?.connected) {
        try {
          await sendMessageApi(
            msg.tenantId,
            msg.roomId,
            msg.senderId,
            msg.content
          );
          return true;
        } catch (e) {
          console.error("[REST] Failed to send message", e);
          return false;
        }
      }

      // 🟢 Receiver online → WebSocket
      try {
        client.publish({
          destination: "/app/sendMessage",
          body: JSON.stringify(msg),
        });
        return true;
      } catch (e) {
        console.warn("[STOMP] WebSocket failed — fallback REST");
        try {
          await sendMessageApi(
            msg.tenantId,
            msg.roomId,
            msg.senderId,
            msg.content
          );
          return true;
        } catch (err) {
          console.error("[REST] Fallback also failed", err);
          return false;
        }
      }
    },
    [onlineUsers, receiverId]
  );

  return { connected, sendMessage, onlineUsers };
}
