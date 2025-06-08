import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { Song, useSongsStore } from '../store/songsStore';

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  play: (song: Song) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  queue: Song[];
  currentQueueIndex: number;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  setQueue: (newQueue: Song[]) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setInternalVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { songs } = useSongsStore(); // Access songs from the store

  // Define playback functions using useCallback to ensure stability
  const play = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (!queue.some(s => s.id === song.id)) {
      setQueueState([song]);
      setCurrentQueueIndex(0);
    } else {
      const index = queue.findIndex(s => s.id === song.id);
      setCurrentQueueIndex(index);
    }
  }, [queue]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((vol: number) => {
    setInternalVolume(vol);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    const nextIndex = (currentQueueIndex + 1) % queue.length;
    setCurrentQueueIndex(nextIndex);
    play(queue[nextIndex]);
  }, [currentQueueIndex, queue, play]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    const prevIndex = (currentQueueIndex - 1 + queue.length) % queue.length;
    setCurrentQueueIndex(prevIndex);
    play(queue[prevIndex]);
  }, [currentQueueIndex, queue, play]);

  const addToQueue = useCallback((song: Song) => {
    setQueueState(prev => {
      if (!prev.some(s => s.id === song.id)) {
        return [...prev, song];
      }
      return prev;
    });
  }, []);

  const removeFromQueue = useCallback((songId: string) => {
    setQueueState(prev => {
      const newQueue = prev.filter(s => s.id !== songId);
      // Adjust currentQueueIndex if the removed song was before or is the current song
      if (currentSong?.id === songId && newQueue.length > 0) {
        const nextSong = newQueue[Math.min(currentQueueIndex, newQueue.length - 1)];
        play(nextSong);
      } else if (currentSong?.id === songId && newQueue.length === 0) {
        setCurrentSong(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      } else if (newQueue.length > 0 && currentQueueIndex >= newQueue.length) {
        setCurrentQueueIndex(newQueue.length - 1);
      }
      return newQueue;
    });
  }, [currentSong, currentQueueIndex, play]);

  const clearQueue = useCallback(() => {
    setQueueState([]);
    setCurrentQueueIndex(-1);
    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const setFullQueue = useCallback((newQueue: Song[]) => {
    setQueueState(newQueue);
    if (newQueue.length > 0) {
      setCurrentQueueIndex(0);
      play(newQueue[0]);
    } else {
      clearQueue();
    }
  }, [play, clearQueue]);

  // Initialize audio element and attach event listeners
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };
      audioRef.current.ondurationchange = () => {
        setDuration(audioRef.current?.duration || 0);
      };
      audioRef.current.onended = () => {
        playNext(); // playNext is now stably defined via useCallback
      };
    }
  }, [playNext, volume]); // Dependencies include playNext and volume

  // Update current song and control playback
  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (audioRef.current.src !== currentSong.url) {
        audioRef.current.src = currentSong.url;
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [currentSong, isPlaying]);

  // Synchronize internal volume with audio element volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        volume,
        currentTime,
        duration,
        play,
        pause,
        setVolume,
        seek,
        playNext,
        playPrevious,
        queue,
        currentQueueIndex,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setQueue: setFullQueue, // Renamed to setQueue in context for clarity
      }}
    >
      {children}
      <audio ref={audioRef} />
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
} 