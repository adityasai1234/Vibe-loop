import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { Song, useSongsStore } from '../store/songsStore';

// Constants
const DEFAULT_CROSSFADE_DURATION = 3; // 3 seconds
const SLEEP_TIMER_PRESETS = [15, 30, 45, 60, 90]; // minutes

// Type for the setupCrossfade function
type SetupCrossfadeFunction = (nextSong: Song) => Promise<void>;

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

  // Sleep Timer properties
  sleepTimer: {
    isActive: boolean;
    remainingTime: number;
    duration: number;
    start: (minutes: number) => void;
    cancel: () => void;
    presets: number[];
  };

  // Crossfade properties
  crossfade: {
    isEnabled: boolean;
    duration: number;
    toggle: () => void;
    setDuration: (seconds: number) => void;
  };
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  // State declarations
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setInternalVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sleep Timer state
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [sleepTimerDuration, setSleepTimerDuration] = useState(0);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(0);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Crossfade state
  const [crossfadeEnabled, setCrossfadeEnabled] = useState(false);
  const [crossfadeDuration, setCrossfadeDuration] = useState(DEFAULT_CROSSFADE_DURATION);
  const [nextAudioContext, setNextAudioContext] = useState<AudioContext | null>(null);
  const [nextGainNode, setNextGainNode] = useState<GainNode | null>(null);
  const [currentGainNode, setCurrentGainNode] = useState<GainNode | null>(null);
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Declare setupCrossfade type before its usage
  const setupCrossfadeRef = useRef<SetupCrossfadeFunction | null>(null);

  const { songs } = useSongsStore(); // Access songs from the store

  // Sleep Timer functions
  const startSleepTimer = useCallback((minutes: number) => {
    // Cancel any existing timer
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
    }

    const durationInSeconds = minutes * 60;
    setSleepTimerDuration(durationInSeconds);
    setSleepTimerRemaining(durationInSeconds);
    setSleepTimerActive(true);

    // Update remaining time every second
    sleepTimerRef.current = setInterval(() => {
      setSleepTimerRemaining(prev => {
        if (prev <= 1) {
          // Timer finished
          if (sleepTimerRef.current) {
            clearInterval(sleepTimerRef.current);
          }
          setSleepTimerActive(false);
          pause();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const cancelSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
    }
    setSleepTimerActive(false);
    setSleepTimerRemaining(0);
    setSleepTimerDuration(0);
  }, []);

  // Setup crossfade with proper type annotation
  const setupCrossfade = useCallback<SetupCrossfadeFunction>(async (nextSong: Song) => {
    const currentAudio = audioRef.current;
    if (!crossfadeEnabled || !currentAudio) return;

    try {
      // Create new audio context for next song
      const newContext = new AudioContext();
      const newGainNode = newContext.createGain();
      newGainNode.gain.value = 0; // Start silent

      // Create audio source
      const response = await fetch(nextSong.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await newContext.decodeAudioData(arrayBuffer);
      const source = newContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(newGainNode);
      newGainNode.connect(newContext.destination);

      // Store references
      setNextAudioContext(newContext);
      setNextGainNode(newGainNode);

      // Start crossfade
      const currentGain = currentAudio.volume ?? 1;
      const fadeOutDuration = crossfadeDuration * 1000;
      const startTime = newContext.currentTime;

      // Fade out current audio
      if (currentGainNode) {
        currentGainNode.gain.setValueAtTime(currentGain, startTime);
        currentGainNode.gain.linearRampToValueAtTime(0, startTime + fadeOutDuration / 1000);
      }

      // Fade in next audio
      newGainNode.gain.setValueAtTime(0, startTime);
      newGainNode.gain.linearRampToValueAtTime(currentGain, startTime + fadeOutDuration / 1000);

      // Start next audio
      source.start(startTime);

      // Clean up after crossfade
      crossfadeTimeoutRef.current = setTimeout(() => {
        if (nextAudioContext) {
          nextAudioContext.close();
        }
        setNextAudioContext(null);
        setNextGainNode(null);
      }, fadeOutDuration);
    } catch (error) {
      console.error('Crossfade error:', error);
      // Fallback to normal playback
      if (setupCrossfadeRef.current) {
        setupCrossfadeRef.current(nextSong);
      }
    }
  }, [crossfadeEnabled, crossfadeDuration]);

  // Store setupCrossfade in ref to avoid circular dependency
  useEffect(() => {
    setupCrossfadeRef.current = setupCrossfade;
  }, [setupCrossfade]);

  // Define play function with proper type annotation
  const play = useCallback((song: Song): void => {
    if (crossfadeEnabled && currentSong && setupCrossfadeRef.current) {
      setupCrossfadeRef.current(song);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
      if (!queue.some(s => s.id === song.id)) {
        setQueueState([song]);
        setCurrentQueueIndex(0);
      } else {
        const index = queue.findIndex(s => s.id === song.id);
        setCurrentQueueIndex(index);
      }
    }
  }, [crossfadeEnabled, currentSong, queue]);

  // Update setupCrossfade dependencies to include play
  useEffect(() => {
    setupCrossfade.dependencies = [crossfadeEnabled, crossfadeDuration, play];
  }, [crossfadeEnabled, crossfadeDuration, play]);

  const toggleCrossfade = useCallback(() => {
    setCrossfadeEnabled(prev => !prev);
  }, []);

  const updateCrossfadeDuration = useCallback((seconds: number) => {
    setCrossfadeDuration(Math.max(0, Math.min(10, seconds)));
  }, []);

  // Cleanup function for crossfade
  useEffect(() => {
    return () => {
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
      }
      if (nextAudioContext) {
        nextAudioContext.close();
      }
    };
  }, [nextAudioContext]);

  // Cleanup function for sleep timer
  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
    };
  }, []);

  // Define playback functions using useCallback to ensure stability
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
      
      // Add error handling for audio loading
      audioRef.current.onerror = (e) => {
        console.error('Audio loading error:', e);
        const error = e.target as HTMLAudioElement;
        let errorMessage = 'Error loading audio';
        
        switch (error.error?.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio playback was aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading audio';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Audio decoding error';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio format not supported';
            break;
        }
        
        console.error(errorMessage);
        setCurrentSong(null);
        setIsPlaying(false);
      };

      // Add CORS error handling
      audioRef.current.onstalled = () => {
        console.warn('Audio playback stalled - possible CORS or network issue');
      };

      // Add other event listeners
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      };
      
      audioRef.current.ondurationchange = () => {
        setDuration(audioRef.current?.duration || 0);
      };
      
      audioRef.current.onended = () => {
        playNext();
      };

      // Add preload handling
      audioRef.current.preload = 'metadata';
    }
  }, [playNext, volume]);

  // Update current song and control playback with improved error handling
  useEffect(() => {
    if (currentSong && audioRef.current) {
      const loadAndPlay = async () => {
        try {
          // Reset error state
          setError(null);
          
          // Set new source
          if (audioRef.current.src !== currentSong.url) {
            audioRef.current.src = currentSong.url;
            
            // Load metadata first
            await audioRef.current.load();
            
            // Check if the audio is actually playable
            if (audioRef.current.readyState >= 2) { // HAVE_CURRENT_DATA
              if (isPlaying) {
                await audioRef.current.play();
              }
            } else {
              throw new Error('Audio not ready for playback');
            }
          } else if (isPlaying) {
            await audioRef.current.play();
          }
        } catch (err) {
          console.error('Error during audio playback:', err);
          setError(err instanceof Error ? err.message : 'Failed to play audio');
          setIsPlaying(false);
        }
      };

      loadAndPlay();
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

  // Handle audio element events with proper type checking
  useEffect(() => {
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioRef.current = audioElement;
      
      const handleTimeUpdate = () => {
        const currentAudio = audioRef.current;
        if (currentAudio && currentAudio.currentTime !== currentTime) {
          seek(currentAudio.currentTime);
        }
        if (isBuffering) {
          setIsBuffering(false);
        }
      };

      const handleError = (e: Event) => {
        if (e instanceof ErrorEvent) {
          console.error('Audio error:', e.error);
        } else {
          console.error('Audio error:', e);
        }
        setError('Error playing audio. Please try again.');
        setIsLoading(false);
        setIsBuffering(false);
      };

      // Add all event listeners
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('error', handleError);

      // Cleanup function
      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('error', handleError);
      };
    }
  }, [currentTime, seek, isPlaying, isBuffering]);

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

        // Sleep Timer values
        sleepTimer: {
          isActive: sleepTimerActive,
          remainingTime: sleepTimerRemaining,
          duration: sleepTimerDuration,
          start: startSleepTimer,
          cancel: cancelSleepTimer,
          presets: SLEEP_TIMER_PRESETS
        },

        // Crossfade values
        crossfade: {
          isEnabled: crossfadeEnabled,
          duration: crossfadeDuration,
          toggle: toggleCrossfade,
          setDuration: updateCrossfadeDuration
        }
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
