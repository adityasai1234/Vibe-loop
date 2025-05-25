import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface SongPlayerProps {
  songTitle: string;
  artist: string;
  audioSrc: string;
  coverArt?: string;
}

export const SongPlayer: React.FC<SongPlayerProps> = ({
  songTitle,
  artist,
  audioSrc,
  coverArt = 'https://via.placeholder.com/300x300?text=Cover+Art'
}) => {
  const { isDark } = useThemeStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  return (
    <div className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Cover Art */}
        <div className="w-full md:w-1/3 aspect-square rounded-lg overflow-hidden shadow-md">
          <img 
            src={coverArt} 
            alt={`${songTitle} by ${artist}`} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Player Controls */}
        <div className="w-full md:w-2/3 flex flex-col space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{songTitle}</h2>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{artist}</p>
          </div>

          {/* Audio Element */}
          <audio 
            ref={audioRef}
            src={audioSrc}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Progress Bar */}
          <div className="w-full flex items-center space-x-2">
            <span className="text-sm">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(currentTime / (duration || 1)) * 100}%, ${isDark ? '#4B5563' : '#E5E7EB'} ${(currentTime / (duration || 1)) * 100}%, ${isDark ? '#4B5563' : '#E5E7EB'} 100%)`
              }}
            />
            <span className="text-sm">{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-6">
            <button 
              className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Previous track"
            >
              <SkipBack size={24} />
            </button>
            <button 
              onClick={togglePlay}
              className={`p-4 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button 
              className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label="Next track"
            >
              <SkipForward size={24} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleMute}
              className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(isMuted ? 0 : volume) * 100}%, ${isDark ? '#4B5563' : '#E5E7EB'} ${(isMuted ? 0 : volume) * 100}%, ${isDark ? '#4B5563' : '#E5E7EB'} 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};