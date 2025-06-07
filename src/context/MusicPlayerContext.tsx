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
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setInternalVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { songs } = useSongsStore(); // Access songs from the store

  // Define playback functions using useCallback to ensure stability
  const play = useCallback((song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

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
    const currentIndex = currentSong ? songs.findIndex(s => s.id === currentSong.id) : -1;
    if (currentIndex !== -1 && currentIndex < songs.length - 1) {
      play(songs[currentIndex + 1]);
    } else {
      // Loop back to the first song if at the end of the list
      if (songs.length > 0) {
        play(songs[0]);
      } else {
        pause();
      }
    }
  }, [currentSong, songs, play, pause]);

  const playPrevious = useCallback(() => {
    const currentIndex = currentSong ? songs.findIndex(s => s.id === currentSong.id) : -1;
    if (currentIndex > 0) {
      play(songs[currentIndex - 1]);
    } else {
      // Loop to the last song if at the beginning of the list
      if (songs.length > 0) {
        play(songs[songs.length - 1]);
      } else {
        pause();
      }
    }
  }, [currentSong, songs, play, pause]);

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