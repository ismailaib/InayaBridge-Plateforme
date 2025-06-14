'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Send, Mic, MicOff } from 'lucide-react';
import UI from './components/UI';
import { useChatStore } from '@/store/ChatStore';

export default function Page() {
  // état pour animation de chargement initiale
  const [isLoading, setLoadingLocal] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // état pour le champ de saisie
  const [inputValue, setInputValue] = useState('');

  // état pour l’icône micro
  const [isRecording, setIsRecording] = useState(false);

  // récupérer depuis le store :
  // - sendMessage : action qui envoie le texte au backend /store
  // - chatLoading   : drapeau de chargement côté chat
  const sendMessage = useChatStore((state) => state.sendMessage);
  const chatLoading = useChatStore((state) => state.isLoading);

  // Animation de chargement initial pour le Canvas
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
    <div className="absolute inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-500">
      <div className="text-center px-4">
        <div className="text-gray-500 text-lg mb-4">
          {progress < 30 && 'On cherche les chaussettes du serveur...'}
          {progress >= 30 && progress < 60 && 'On gonfle les pneus de l\'environnement...'}
          {progress >= 60 && progress < 90 && 'On ajuste la caméra, attention au selfie !'}
          {progress >= 90 && "C'est presque prêt... Suspense maximal !"}
        </div>
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-800 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );

  // Appelé quand l’utilisateur clique sur “Envoyer” ou “Enter”
  const handleSend = () => {
    if (!inputValue.trim()) return;
    // déléguer au store : il ajoute le message user + fait l'appel backend
    sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleAudioToggle = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      console.log('Starting audio recording...');
    } else {
      console.log('Stopping audio recording...');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex flex-col h-screen">
      {isLoading && <LoadingScreen progress={loadingProgress} />}

      <div
        className={`flex-1 transition-opacity duration-700 ease-in-out ${
          isLoading
            ? 'opacity-0 translate-y-24 pointer-events-none'
            : 'opacity-100 translate-y-0'
        }`}
        style={{ transitionProperty: 'opacity, transform' }}
      >
        <Canvas shadows camera={{ position: [0, 0, 1], fov: 40 }} className="w-full h-full">
          <Experience />
        </Canvas>
      </div>

      {/* Affiche le chat (messages et état de chargement) */}
      <UI />

      {/* Barre fixe en bas pour taper et envoyer un message */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Posez votre question médicale ici ou décrivez le problème du patient..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <Button
            onClick={handleAudioToggle}
            variant={isRecording ? 'destructive' : 'secondary'}
            className={isRecording ? 'animate-pulse' : ''}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Button onClick={handleSend} disabled={chatLoading || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
