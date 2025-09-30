'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Music, Play, Pause, Volume2, X } from 'lucide-react';

declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubeMusicPopoverProps {
  className?: string;
}

interface MusicState {
  isPlaying: boolean;
  currentVideo: string | null;
  videoTitle: string | null;
  isLoading: boolean;
  error: string | null;
}

const YouTubeMusicPopover: React.FC<YouTubeMusicPopoverProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [musicState, setMusicState] = useState<MusicState>({
    isPlaying: false,
    currentVideo: null,
    videoTitle: null,
    isLoading: false,
    error: null,
  });

  const playerRef = useRef<any>(null);
  const playerRefContainer = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }, []);

  const initializePlayer = (videoId: string) => {
    if (!playerRefContainer.current) return;

    if (playerRef.current) {
      playerRef.current.loadVideoById(videoId);
      return;
    }

    playerRef.current = new window.YT.Player(playerRefContainer.current, {
      height: '0',
      width: '0',
      videoId,
      playerVars: { autoplay: 0, controls: 0, modestbranding: 1, playsinline: 1 },
      events: {
        onReady: () => setMusicState(prev => ({ ...prev, isLoading: false })),
        onStateChange: (event: any) => {
          setMusicState(prev => ({
            ...prev,
            isPlaying: event.data === window.YT.PlayerState.PLAYING,
          }));
        },
        onError: () => setMusicState(prev => ({
          ...prev,
          error: 'Failed to load video',
          isLoading: false,
        })),
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      setMusicState(prev => ({ ...prev, error: 'Invalid YouTube URL' }));
      return;
    }

    setMusicState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      currentVideo: videoId,
    }));

    try {
      const response = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
      );
      const data = await response.json();

      setMusicState(prev => ({
        ...prev,
        videoTitle: data.title || 'Unknown Title',
        isLoading: false,
      }));

      if (window.YT && window.YT.Player) {
        initializePlayer(videoId);
      } else {
        window.onYouTubeIframeAPIReady = () => initializePlayer(videoId);
      }
    } catch {
      setMusicState(prev => ({
        ...prev,
        error: 'Failed to load video information',
        isLoading: false,
      }));
    }
  };

  const togglePlayback = () => {
    if (!playerRef.current) return;
    musicState.isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const stopMusic = () => {
    playerRef.current?.stopVideo();
    setMusicState({
      isPlaying: false,
      currentVideo: null,
      videoTitle: null,
      isLoading: false,
      error: null,
    });
    setYoutubeUrl('');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <Button
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:scale-105 transition-transform duration-200"
      >
        <Music className={`h-4 w-4 ${musicState.isPlaying ? 'text-blue-500 animate-pulse' : ''}`} />
        <span className="ml-1">Music</span>
        {musicState.isPlaying && <Badge className="ml-2 bg-blue-100 text-blue-600 animate-pulse">Playing</Badge>}
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 z-50 shadow-lg border border-gray-200 bg-white/95 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900">Music Player</h2>
            </div>
            <Button variant="light" onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-md">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {musicState.currentVideo && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-blue-900 truncate">{musicState.videoTitle || 'Loading...'}</div>
                  <div className="text-xs text-blue-600">{musicState.isPlaying ? 'Now Playing' : 'Paused'}</div>
                </div>
                <div className="space-x-1 ml-2">
                  <Button variant="light" onClick={togglePlayback} disabled={musicState.isLoading} className="p-2 hover:bg-blue-100 rounded-md">
                    {musicState.isPlaying ? <Pause className="h-4 w-4 text-blue-600" /> : <Play className="h-4 w-4 text-blue-600" />}
                  </Button>
                  <Button variant="light" onClick={stopMusic} className="p-2 hover:bg-red-100 rounded-md">
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm"
              disabled={musicState.isLoading}
              value={youtubeUrl}
              placeholder="Paste YouTube music link here..."
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              disabled={!youtubeUrl.trim() || musicState.isLoading}
            >
              {musicState.isLoading ? 'Loading...' : 'Play Music'}
            </Button>
          </form>

          {musicState.error && <p className="text-xs text-red-500 mt-2">{musicState.error}</p>}
        </Card>
      )}

      <div ref={playerRefContainer}></div>
    </div>
  );
};

export default YouTubeMusicPopover;
