import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [songInfo, setSongInfo] = useState<{ title: string; artist: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

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
    songInfo
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