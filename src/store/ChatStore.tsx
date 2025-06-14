// store/ChatStore.ts
import create from 'zustand';

export type LipsyncEntry = {
  start: number;    // seconde où commence ce viseme
  end: number;      // seconde où se termine
  value: string;    // lettre (ex: "A", "B", etc.) mappée à un morph target
};

export type Message = {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: number;
  audio: string | null;        // base64 ou null
  lipsync: LipsyncEntry[] | null;
  facialExpression: string;    // exemple: "smile"
  animation: string;           // exemple: "Idle1"
};

interface ChatState {
  messages: Message[];
  isLoading: boolean;

  addMessage: (m: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [
    {
      id: crypto.randomUUID(),
      sender: 'ai',
      content: "Bonjour, comment puis-je vous aider aujourd'hui ?",
      timestamp: Date.now(),
      audio: null,
      lipsync: null,
      facialExpression: 'default',
      animation: 'Idle',
    },
  ],
  isLoading: false,

  addMessage: ({ sender, content, audio = null, lipsync = null, facialExpression, animation }) => {
    const newMsg: Message = {
      id: crypto.randomUUID(),
      sender,
      content,
      timestamp: Date.now(),
      audio,
      lipsync,
      facialExpression,
      animation,
    };
    set((state) => ({ messages: [...state.messages, newMsg] }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Quand l’utilisateur envoie un texte, on :
  // 1) ajoute immédiatement le message user
  // 2) fait l’appel POST vers /chat du backend (localhost:3001)
  // 3) pour chaque objet reçu dans data.messages, on l’ajoute en tant qu’IA
  sendMessage: async (content: string) => {
    const { addMessage, setLoading } = get();

    // 1) message user
    addMessage({
      sender: 'user',
      content,
      audio: null,
      lipsync: null,
      facialExpression: 'default',
      animation: 'Idle',
    });

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      if (data.messages && Array.isArray(data.messages)) {
        data.messages.forEach((m: any) => {
          addMessage({
            sender: 'ai',
            content: m.text,
            audio: m.audio || null,
            lipsync: m.lipsync || null,
            facialExpression: m.facialExpression || 'default',
            animation: m.animation || 'Idle',
          });
        });
      }
    } catch (err) {
      console.error('Erreur dans sendMessage:', err);
      addMessage({
        sender: 'ai',
        content: "Désolé, une erreur est survenue. Veuillez réessayer plus tard.",
        audio: null,
        lipsync: null,
        facialExpression: 'default',
        animation: 'Idle',
      });
    } finally {
      setLoading(false);
    }
  },
}));
