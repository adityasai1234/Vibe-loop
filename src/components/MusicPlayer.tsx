import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useThemeStore } from '../store/themeStore';
import { useLikedSongs } from '../context/LikedSongsContext';
import { Play, Pause, SkipBack, SkipForward, Heart, Loader2, Repeat, Shuffle } from 'lucide-react';
import { Song } from '../store/songsStore';
import { PlayerControls } from './PlayerControls';

export const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, play, pause, duration, currentTime, setVolume, seek, playNext, playPrevious, volume, isRepeat, setIsRepeat, isShuffle, setIsShuffle } = useMusicPlayer();
  const { isDark } = useThemeStore();
  const { isLiked, toggleLike } = useLikedSongs();
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [updateFrequency, setUpdateFrequency] = useState(100);
  const seekStep = 5; // seconds to seek on keyboard navigation

  // Get audio element and set up event listeners
  useEffect(() => {
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioRef.current = audioElement;
      
      const handleTimeUpdate = () => {
        if (audioElement.currentTime !== currentTime) {
          seek(audioElement.currentTime);
        }
        // Clear buffering state if we're receiving time updates
        if (isBuffering) {
          setIsBuffering(false);
        }
      };

      const handleLoadedMetadata = () => {
        setError(null);
        setIsLoading(false);
        setIsBuffering(false);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
        setIsBuffering(false);
      };

      const handleSeeked = () => {
        setIsBuffering(false);
      };

      const handleWaiting = () => {
        // Only set buffering if we're actually playing
        if (isPlaying) {
          setIsBuffering(true);
        }
      };

      const handlePlaying = () => {
        setIsBuffering(false);
        setIsLoading(false);
      };

      const handlePlay = () => {
        setIsBuffering(false);
        setIsLoading(false);
      };

      const handlePause = () => {
        setIsBuffering(false);
      };

      const handleError = (e: Event) => {
        console.error('Audio error:', e);
        setError('Error playing audio. Please try again.');
        setIsLoading(false);
        setIsBuffering(false);
      };

      const handleStalled = () => {
        if (isPlaying) {
          setIsBuffering(true);
        }
      };

      // Add all event listeners
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('canplay', handleCanPlay);
      audioElement.addEventListener('seeked', handleSeeked);
      audioElement.addEventListener('waiting', handleWaiting);
      audioElement.addEventListener('playing', handlePlaying);
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('error', handleError);
      audioElement.addEventListener('stalled', handleStalled);

      // Cleanup function
      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('canplay', handleCanPlay);
        audioElement.removeEventListener('seeked', handleSeeked);
        audioElement.removeEventListener('waiting', handleWaiting);
        audioElement.removeEventListener('playing', handlePlaying);
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('error', handleError);
        audioElement.removeEventListener('stalled', handleStalled);
      };
    }
  }, [currentTime, seek, isPlaying, isBuffering]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!audioRef.current) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        seek(Math.max(0, currentTime - seekStep));
        break;
      case 'ArrowRight':
        e.preventDefault();
        seek(Math.min(duration, currentTime + seekStep));
        break;
      case 'Home':
        e.preventDefault();
        seek(0);
        break;
      case 'End':
        e.preventDefault();
        seek(duration);
        break;
    }
  }, [currentTime, duration, seek]);

  // Update frequency based on playback state
  useEffect(() => {
    if (isPlaying) {
      setUpdateFrequency(100); // More frequent updates during playback
    } else {
      setUpdateFrequency(500); // Less frequent updates when paused
    }
  }, [isPlaying]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!currentSong) return null;

  const handleLike = async () => {
    if (!currentSong) return;
    
    const songToLike: Song = {
      id: currentSong.id,
      title: currentSong.title,
      artist: currentSong.artist,
      coverUrl: currentSong.coverUrl,
      url: currentSong.url,
      album: currentSong.album,
      duration: currentSong.duration,
      genre: currentSong.genre,
      mood: currentSong.mood,
      releaseDate: currentSong.releaseDate,
    };
    
    await toggleLike(songToLike);
  };

  const formatTime = (seconds: number, showMilliseconds = false) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = showMilliseconds ? `.${Math.floor((seconds % 1) * 1000)}` : '';
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}${ms}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !isDragging) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const time = percentage * duration;
    setHoverTime(Math.max(0, Math.min(time, duration)));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    setIsDragging(true);
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const time = percentage * duration;
    seek(Math.max(0, Math.min(time, duration)));
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (hoverTime !== null) {
        seek(hoverTime);
      }
    }
  };

  const handlePlayPause = async () => {
    try {
      setError(null);
      if (isPlaying) {
        pause();
        setIsBuffering(false);
      } else {
        setIsLoading(true);
        // Preload the audio before playing
        if (audioRef.current) {
          audioRef.current.load();
          await audioRef.current.play();
        }
        await play(currentSong);
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Failed to play song. Please try again.');
      setIsBuffering(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-4 sm:p-6 shadow-lg transition-colors duration-300 ${
      isDark ? 'bg-secondary-950 border-t border-secondary-800' : 'bg-white border-t border-secondary-200'
    }`}>
      {/* Error Toast */}
      {error && (
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mt-2 px-4 py-2 rounded-lg shadow-lg ${
          isDark ? 'bg-red-900 text-white dark:text-black' : 'bg-red-100 text-red-900'
        }`}>
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Song Info */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
              className={`w-12 h-12 rounded-md shadow-md transition-opacity duration-200 ${
                isBuffering ? 'opacity-50' : 'opacity-100'
              }`}
            />
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-lg truncate ${
              isDark ? 'text-secondary-100 dark:text-white' : 'text-secondary-900'
            }`}>
              {currentSong.title}
            </h3>
            <p className={`text-sm truncate ${
              isDark ? 'text-secondary-400' : 'text-secondary-600'
            }`}>
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Main Playback Controls and Progress Bar */}
        <div className="flex flex-col items-center flex-1 w-full sm:w-auto px-0 sm:px-4">
          <div className="flex items-center space-x-4 mb-3">
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`p-2 rounded-full transition-colors duration-200 ${isShuffle ? (isDark ? 'bg-primary-700 text-white' : 'bg-primary-500 text-white') : (isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100')}`}
              title="Shuffle"
            >
              <Shuffle size={20} />
            </button>
            <button
              onClick={playPrevious}
              disabled={isLoading}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className={`p-3 rounded-full shadow-md transition-all duration-200 ${
                isDark ? 'bg-primary-600 text-white dark:text-black hover:bg-primary-700' : 'bg-primary-500 text-white dark:text-black hover:bg-primary-600'
              } ${isLoading ? 'opacity-75 cursor-wait' : ''} ${
                isBuffering ? 'animate-pulse' : ''
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
            </button>
            <button
              onClick={playNext}
              disabled={isLoading}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <SkipForward size={20} />
            </button>
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`p-2 rounded-full transition-colors duration-200 ${isRepeat ? (isDark ? 'bg-primary-700 text-white' : 'bg-primary-500 text-white') : (isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100')}`}
              title="Repeat"
            >
              <Repeat size={20} />
            </button>
          </div>
          
          {/* Progress Bar Section */}
          <div className="flex flex-col sm:flex-row items-center w-full max-w-xl space-y-1 sm:space-y-0 sm:space-x-2 text-sm">
            {/* Time Display - Mobile (above) */}
            <div className="flex justify-between w-full sm:hidden text-xs font-mono">
              <span className={isDark ? 'text-secondary-400' : 'text-secondary-600'}>
                {formatTime(currentTime)}
              </span>
              <span className={isDark ? 'text-secondary-400' : 'text-secondary-600'}>
                {formatTime(duration)}
              </span>
            </div>

            {/* Time Display - Desktop (inline) */}
            <span className={`hidden sm:inline min-w-[3.5rem] text-right font-mono ${
              isDark ? 'text-secondary-400' : 'text-secondary-600'
            }`}>
              {formatTime(currentTime)}
            </span>
            
            {/* Progress Bar Container */}
            <div 
              ref={progressBarRef}
              role="slider"
              tabIndex={0}
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
              aria-label="Song progress"
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              onKeyDown={handleKeyDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                setHoverTime(null);
                if (!isDragging) setIsDragging(false);
              }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={(e) => {
                const touch = e.touches[0];
                const target = e.currentTarget;
                const rect = target.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const percentage = x / rect.width;
                const time = percentage * duration;
                seek(Math.max(0, Math.min(time, duration)));
              }}
              className={`relative flex-1 h-2 group cursor-pointer ${
                isDark ? 'bg-secondary-700/50' : 'bg-secondary-300/50'
              } rounded-full overflow-hidden transition-colors duration-200`}
            >
              {/* Background track */}
              <div className="absolute inset-0 rounded-full" />
              
              {/* Buffering indicator - only show when actually buffering */}
              {isBuffering && isPlaying && (
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className={`absolute inset-0 ${
                    isDark ? 'bg-secondary-600' : 'bg-secondary-400'
                  } animate-pulse`} 
                  style={{
                    animationDuration: '1s',
                    animationTimingFunction: 'ease-in-out'
                  }}
                  />
                </div>
              )}
              
              {/* Played track */}
              <div 
                className={`absolute h-full rounded-full transition-all duration-100 ${
                  isDark ? 'bg-primary-500' : 'bg-primary-600'
                } ${isBuffering ? 'opacity-50' : ''}`}
                style={{ 
                  width: `${((hoverTime ?? currentTime) / duration) * 100}%`,
                  transition: isDragging ? 'none' : 'width 100ms linear'
                }}
              />
              
              {/* Hover preview */}
              {hoverTime !== null && (
                <div 
                  className="absolute top-0 h-full w-0.5 bg-white/50 rounded-full pointer-events-none"
                  style={{ left: `${(hoverTime / duration) * 100}%` }}
                />
              )}
              
              {/* Seek input (hidden but accessible) */}
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
                disabled={isLoading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ 
                  WebkitAppearance: 'none',
                  pointerEvents: isDragging ? 'none' : 'auto'
                }}
              />
              
              {/* Hover time tooltip */}
              {hoverTime !== null && (
                <div 
                  className={`absolute bottom-full mb-2 px-2 py-1 rounded text-xs font-medium transform -translate-x-1/2 ${
                    isDark ? 'bg-secondary-800 text-white dark:text-black' : 'bg-white text-secondary-900 dark:text-white'
                  } shadow-lg pointer-events-none`}
                  style={{ 
                    left: `${(hoverTime / duration) * 100}%`,
                    transition: 'none'
                  }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>
            
            {/* Time Display - Desktop (inline) */}
            <span className={`hidden sm:inline min-w-[3.5rem] font-mono ${
              isDark ? 'text-secondary-400' : 'text-secondary-600'
            }`}>
              {formatTime(duration)}
            </span>

            {/* Playback status - only show when actually buffering */}
            <div className="w-full text-center text-xs mt-1">
              {isBuffering && isPlaying && (
                <span className={`${isDark ? 'text-secondary-400' : 'text-secondary-600'}`}>
                  Buffering...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right section (Like button and Player Controls) */}
        <div className="flex items-center w-full sm:w-auto justify-center sm:justify-end space-x-2">
          <PlayerControls />
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isLiked(currentSong.id)
                ? isDark
                  ? 'text-accent-500 hover:text-accent-400'
                  : 'text-accent-600 hover:text-accent-500'
                : isDark
                ? 'text-secondary-400 hover:text-secondary-100 dark:hover:text-black'
                : 'text-secondary-500 hover:text-secondary-800 dark:hover:text-white'
            }`}
          >
            <Heart
              size={20}
              className={`sm:w-5 sm:h-5 ${isLiked(currentSong.id) ? 'fill-current' : ''}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
