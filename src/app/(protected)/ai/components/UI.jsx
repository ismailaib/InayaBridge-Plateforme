import { useRef, useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { IoSend } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import { BsFillRecordCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";

export const UI = () => {
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { chat, loading, messages } = useChat();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecordedText(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const sendMessage = () => {
    const text = (inputRef.current?.value || recordedText).trim();
    if (text && !loading) {
      chat(text);
      if (inputRef.current) inputRef.current.value = "";
      setRecordedText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      setRecordedText("");
      recognition.start();
    }
    setIsRecording(!isRecording);
  };

  const renderAnimatedMessage = (text) => {
    // First, split the text by spaces to get individual words
    const words = text.split(" ");
    
    return words.map((word, index) => {
      // Check if the word has bold markers
      if (word.includes("**")) {
        // Split the word by ** markers
        const parts = word.split("**");
        // Create an array to hold the processed parts
        const processedParts = [];
        
        // Process each part
        parts.forEach((part, partIndex) => {
          // If it's an even index (0, 2, 4...), it's normal text
          // If it's an odd index (1, 3, 5...), it's bold text
          if (part) {
            processedParts.push(
              <span 
                key={`${index}-${partIndex}`} 
                className={partIndex % 2 === 1 ? "font-bold" : ""}
              >
                {part}
              </span>
            );
          }
        });
        
        // Return the word with bold formatting in a motion span
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="inline-block"
          >
            {processedParts}
          </motion.span>
        );
      } else {
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {" "} {word} {" "}
          </motion.span>
        );
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-transparent flex flex-col z-10" style={{ width: "50%", background: "radial-gradient(#ffffff3b, transparent)", padding: "30px" }}>

      {/* <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === "user" ? "bg-green-500 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"}`}>
              {msg.role === "assistant" ? renderAnimatedMessage(msg.content) : msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white shadow-lg rounded-xl">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            ref={inputRef}
            value={recordedText}
            onChange={(e) => setRecordedText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question sur l'agriculture..."
            className="flex-1 p-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoSend className="w-5 h-5" />
          </button>

          <button
            onClick={toggleRecording}
            className="p-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isRecording ? (
              <BsFillRecordCircleFill className="w-5 h-5 text-red-600 animate-pulse" />
            ) : (
              <FaMicrophone className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default UI;