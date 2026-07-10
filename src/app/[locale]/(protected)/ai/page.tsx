"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useChatStore } from "@/store/ChatStore";
import { Canvas } from "@react-three/fiber";
import { Mic, MicOff, Send } from "lucide-react";

import { useEffect, useState } from "react";

import { Experience } from "./components/Experience";
import UI from "./components/UI";

export default function Page() {
  const t = useTranslations("chat.chat.page");

  const [isLoading, setLoadingLocal] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const sendMessage = useChatStore((state) => state.sendMessage);
  const chatLoading = useChatStore((state) => state.isLoading);

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => setLoadingLocal(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(loadingInterval);
  }, []);

  const LoadingScreen = ({ progress }: { progress: number }) => (
    <div className="absolute inset-0 bg-white dark:bg-gray-950 flex items-center justify-center z-50 transition-opacity duration-500">
      <div className="text-center px-4">
        <div className="text-gray-500 text-lg mb-4">
          {progress < 30 && t("loading.sock")}
          {progress >= 30 && progress < 60 && t("loading.tires")}
          {progress >= 60 && progress < 90 && t("loading.camera")}
          {progress >= 90 && t("loading.almost")}
        </div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-800 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleAudioToggle = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      console.log("Starting audio recording...");
    } else {
      console.log("Stopping audio recording...");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {isLoading && <LoadingScreen progress={loadingProgress} />}

      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isLoading
            ? "opacity-0 translate-y-24 pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 0, 1], fov: 40 }}
          className="w-full h-full"
        >
          <Experience />
        </Canvas>
      </div>

      <UI />

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 z-10">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder={t("placeholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <Button
            onClick={handleAudioToggle}
            variant={isRecording ? "destructive" : "secondary"}
            className={isRecording ? "animate-pulse" : ""}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          <Button
            onClick={handleSend}
            disabled={chatLoading || !inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
