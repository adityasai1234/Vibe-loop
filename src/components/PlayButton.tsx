import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface PlayButtonProps {
  audioSrc?: string;
  songTitle?: string;
  artist?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'minimal';
  showLabel?: boolean;
  className?: string;
}

export const PlayButton: React.FC<PlayButtonProps> = ({
  audioSrc = 'https://adityasai1234.github.io/static-site-for-vibeloop/youtube_fJ9rUzIMcZQ_audio.mp3',
  songTitle = 'Bohemian Rhapsody',
  artist = 'Queen',
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = ''
}) => {
  const { isPlaying, currentSong, play, pause } = useAudio();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if this component's song is currently playing
  const isThisSongPlaying = isPlaying && currentSong === audioSrc;
  
  // Reset error state when audio source changes
  useEffect(() => {
    setError(null);
  }, [audioSrc]);
  
  // Handle play/pause toggle
  const handlePlayPause = async () => {
    if (isThisSongPlaying) {
      pause();
      console.log('Audio paused');
    } else {
      setIsLoading(true);
      setError(null);
      
      // Verify the audio source URL
      console.log(`Attempting to play audio from: ${audioSrc}`);
      
      try {
        // Test if the audio URL is accessible
        const testFetch = await fetch(audioSrc, { method: 'HEAD' })
          .catch(err => {
            console.error('Error fetching audio source:', err);
            throw new Error(`Network error: Cannot access ${audioSrc}`);
          });
          
        if (!testFetch.ok) {
          throw new Error(`HTTP error: ${testFetch.status} ${testFetch.statusText}`);
        }
        
        // If fetch was successful, try to play
        await play(audioSrc, songTitle, artist);
        console.log(`Successfully initiated playback: ${songTitle} by ${artist}`);
      } catch (err) {
        console.error('Detailed playback error:', err);
        
        // Provide more specific error messages based on the error type
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
          setError('Browser blocked autoplay. Please click again.');
        } else if (err.message && err.message.includes('Network error')) {
          setError('Cannot access audio file. Check your connection.');
        } else if (err.message && err.message.includes('HTTP error')) {
          setError('Audio file not available. Try again later.');
        } else {
          setError('Failed to play audio. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-white',
    minimal: 'bg-transparent hover:bg-gray-800/10 text-gray-800 dark:text-white'
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={handlePlayPause}
        disabled={isLoading}
        className={`
          ${sizeClasses[size]} 
          ${variantClasses[variant]} 
          rounded-full flex items-center justify-center 
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50
          ${isLoading ? 'opacity-70 cursor-wait' : ''}
          ${error ? 'bg-red-500 hover:bg-red-600' : ''}
        `}
        aria-label={isThisSongPlaying ? 'Pause' : 'Play'}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : isThisSongPlaying ? (
          <Pause size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
        ) : error ? (
          <VolumeX size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
        ) : (
          <Play size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
        )}
      </button>
      
      {showLabel && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium">
            {isThisSongPlaying ? 'Now Playing' : 'Play'}
          </p>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      )}
      
      {isThisSongPlaying && (
        <div className="mt-1 flex items-center justify-center">
          <span className="flex space-x-1">
            <span className="w-1 h-3 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1 h-4 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
            <span className="w-1 h-3 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></span>
          </span>
        </div>
      )}
    </div>
  );
};


export default PlayButton;
