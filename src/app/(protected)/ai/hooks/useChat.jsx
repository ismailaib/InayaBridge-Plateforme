import { createContext, useContext, useState } from "react";

const backendUrl = "http://localhost:3000/chat"; 

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);


  const chat = async (message) => {
    if (!message) return;
  
    setMessages((prev) => [...prev, { role: "user", content: message }]);
  
    setLoading(true);
  
    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
  
      const data = await response.json();
  
      if (data.messages && Array.isArray(data.messages)) {
        const newMessages = data.messages.map((msg) => ({
          role: "assistant",
          content: msg.text || "Réponse vide",
          audio: msg.audio || null,
          lipsync: msg.lipsync || null,
          facialExpression: msg.facialExpression || "neutral",
          animation: msg.animation || "Idle",
        }));
  
        setMessages((prev) => [...prev, ...newMessages]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Réponse invalide du serveur", audio: null, lipsync: null, facialExpression: "neutral", animation: "Idle" }
        ]);
      }
  
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur de connexion", audio: null, lipsync: null, facialExpression: "neutral", animation: "Idle" }
      ]);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ChatContext.Provider value={{ chat, messages, loading, cameraZoomed, setCameraZoomed }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
