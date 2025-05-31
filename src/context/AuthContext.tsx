import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useAuth } from '/src/context/AuthContext.tsx';

interface AudioContextType {
  isPlaying: boolean;
  currentSong: string | null;
  play: (songUrl: string, songTitle?: string, artist?: string) => Promise<void>;
  pause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  songInfo: {
    title: string;
    artist: string;
  } | null;
  duration: number;
  currentTime: number;
  formatTime: (time: number) => string;
  progress: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [songInfo, setSongInfo] = useState<{ title: string; artist: string } | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Add event listeners for time updates and metadata loading
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('durationchange', handleDurationChange);
    }
    
    // Sync playback rate from player store
    const unsubscribe = usePlayerStore.subscribe(
      (state) => state.playbackRate,
      (playbackRate) => {
        if (audioRef.current) {
          audioRef.current.playbackRate = playbackRate;
          console.log(`Playback rate set to: ${playbackRate}`);
        }
      }
    );

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('durationchange', handleDurationChange);
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      unsubscribe();
    };
  }, []);
  
  // Handle time updates for progress tracking
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    }
  };
  
  // Handle metadata loading to get duration
  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
      console.log(`Audio duration loaded: ${audioRef.current.duration}s`);
    }
  };
  
  // Handle duration changes
  const handleDurationChange = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
      console.log(`Audio duration updated: ${audioRef.current.duration}s`);
    }
  };
  
  // Format time in minutes:seconds
  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Play function
  const play = async (songUrl: string, songTitle = 'Unknown Song', artist = 'Unknown Artist') => {
    if (!audioRef.current) return;

    // If it's a different song, load the new source
    if (currentSong !== songUrl) {
      console.log(`Loading audio from: ${songUrl}`);
      audioRef.current.src = songUrl;
      audioRef.current.load();
      setCurrentSong(songUrl);
      setSongInfo({ title: songTitle, artist });
      
      // Add event listeners for debugging
      audioRef.current.addEventListener('canplay', () => {
        console.log('Audio can play now');
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio element error:', e);
        const error = audioRef.current?.error;
        if (error) {
          console.error('MediaError code:', error.code, 'MediaError message:', error.message);
        }
      });
    }

    try {
      console.log('Attempting to play audio...');
      const playPromise = audioRef.current.play();
      await playPromise;
      setIsPlaying(true);
      console.log(`Successfully playing: ${songTitle} by ${artist}`);
    } catch (err) {
      console.error('Playback error:', err);
      // Check for common autoplay policy issues
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        console.warn('Autoplay policy prevented playback. User interaction required.');
      }
      // Check for network errors
      if (err instanceof DOMException && err.name === 'NetworkError') {
        console.error('Network error loading audio. Possible CORS issue or invalid URL.');
      }
      
      throw err; // Propagate error to component for UI handling
    }
  };

  // Pause function
  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    console.log('Audio paused.');
  };

  const value = {
    isPlaying,
    currentSong,
    play,
    pause,
    audioRef,
    songInfo,
    duration,
    currentTime,
    formatTime,
    progress
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      {/* Hidden audio element */}
      <audio id="vibeloopAudio" className="hidden">
        <source src="" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface User {
  id: string;
  name: string;
  uid: string;  // Add uid property
  username?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

interface UserProfile {
  photoURL?: string;
  displayName?: string;
  email?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  currentUser?: User | null; // Add currentUser property
  setUser: (u: User | null) => void;
  userProfile?: UserProfile;
  signOutUser?: () => Promise<void>; // Ensure signOutUser is properly defined
  loading?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signOutUser = async () => {
    // Example implementation for signing out
    setUser(null);
    console.log('User signed out');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};