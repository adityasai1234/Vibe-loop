import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useThemeStore } from '../store/themeStore';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Heart, Shuffle, X } from 'lucide-react';
import { useSongsStore } from '../store/songsStore';
import { PlayerControls } from './PlayerControls';

interface MusicPlayerMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MusicPlayerMobileModal: React.FC<MusicPlayerMobileModalProps> = ({ isOpen, onClose }) => {
  const { currentSong, isPlaying, play, pause, duration, currentTime, setVolume, seek, playNext, playPrevious, volume } = useMusicPlayer();
  const { isDark } = useThemeStore();
  const { likedSongs, toggleLike, songs } = useSongsStore();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleToggleLike = () => {
    if (currentSong) {
      toggleLike(currentSong.id);
    }
  };

  const handlePlayRandom = () => {
    if (songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      play(songs[randomIndex]);
    }
  };

  if (!isOpen || !currentSong) {
    return null;
  }

  const isLiked = currentSong ? likedSongs.includes(currentSong.id) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-70"
        onClick={onClose}
      />
      
      <div className={`relative w-full h-4/5 rounded-t-lg shadow-lg transform transition-all duration-300 ease-in-out 
        ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
      `}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <X size={24} />
        </button>

        {/* Song Info */}
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-48 h-48 rounded-lg object-cover shadow-md mb-4"
          />
          <h3 className="text-2xl font-bold truncate mb-1">{currentSong.title}</h3>
          <p className="text-lg text-gray-500 truncate">{currentSong.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full px-8 mb-4">
          <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer 
              ${isDark ? 'bg-gray-600' : 'bg-gray-300'}
            `}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} ${(currentTime / (duration || 1)) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} 100%)`,
            }}
          />
          <span className="text-sm text-gray-500">{formatTime(duration)}</span>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-6 px-8 mb-6">
          <button
            onClick={handlePlayRandom}
            className={`p-3 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <Shuffle size={24} />
          </button>
          <button
            onClick={playPrevious}
            className={`p-3 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <SkipBack size={24} />
          </button>
          <button
            onClick={() => isPlaying ? pause() : play(currentSong)}
            className={`p-4 rounded-full bg-blue-500 text-white dark:text-black ${
              isDark ? 'hover:bg-blue-600' : 'hover:bg-blue-600'
            }`}
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button
            onClick={playNext}
            className={`p-3 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <SkipForward size={24} />
          </button>
          <button
            onClick={handleToggleLike}
            className={`p-3 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Volume Control and Player Settings */}
        <div className="flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
              className={`p-2 rounded-full ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className={`w-32 h-2 rounded-lg appearance-none cursor-pointer 
                ${isDark ? 'bg-gray-600' : 'bg-gray-300'}
              `}
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(volume / 1) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} ${(volume / 1) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} 100%)`,
              }}
            />
          </div>
          <PlayerControls />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerMobileModal;