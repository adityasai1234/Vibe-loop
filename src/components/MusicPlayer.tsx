// No-op change to re-trigger linter evaluation
import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useThemeStore } from '../store/themeStore';

import { useLikedSongs } from '../context/LikedSongsContext';
import { Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, play, pause, duration, currentTime, setVolume, seek, playNext, playPrevious, volume } = useMusicPlayer();
  const { isDark } = useThemeStore();
  const { likedSongs, toggleLike, songs } = useSongsStore();


  const isMobile = width !== undefined && width < 640;
  const isTablet = width !== undefined && width >= 640 && width < 1024;
  const isDesktop = width !== undefined && width >= 1024;

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

  if (!currentSong) {
    return null; // Don't render player if no song is loaded
  }

  // Hide this player on mobile, as BottomNav handles it
  if (isMobile) {
    return null;
  }

  const isLiked = currentSong ? likedSongs.includes(currentSong.id) : false;

  const handleLike = async () => {
    if (!currentSong) return;
    
    const songToLike = {
      id: currentSong.id,
      title: currentSong.title,
      artist: currentSong.artist,
      coverUrl: currentSong.coverUrl,
      audioUrl: currentSong.url,
    };
    
    await toggleLike(songToLike);
  };

  return (

    <div className={`fixed bottom-0 left-0 right-0 p-2 sm:p-4 ${
      isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Song Info - Stack vertically on mobile, horizontal on desktop */}
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-md"
          />
          <div className="min-w-0 flex-1 sm:flex-none">
            <h3 className={`font-medium truncate text-sm sm:text-base ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {currentSong.title}
            </h3>
            <p className={`text-xs sm:text-sm truncate ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {currentSong.artist}
            </p>
          </div>
=======
    <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 shadow-lg 
      ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}
      ${isTablet ? 'h-20 flex items-center justify-between' : 'flex items-center justify-between'} 
      ${isDesktop ? '' : ''} 
    `}>
      {/* Song Info */}
      <div className={`flex items-center gap-4 ${isTablet ? 'w-1/3' : 'w-1/4'}`}>
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          className="w-12 h-12 rounded-md object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-medium truncate">{currentSong.title}</h3>
          <p className="text-sm text-gray-500 truncate">{currentSong.artist}</p>

        </div>
      </div>

        {/* Controls - Center on mobile, right-aligned on desktop */}
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={() => {}}
            className={`p-1.5 sm:p-2 rounded-full ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
=
      {/* Player Controls */}
      <div className={`flex flex-col items-center justify-center gap-2 ${isTablet ? 'w-1/3' : 'w-1/2'}`}>
        <div className="flex items-center gap-4">
          {/* Shuffle */}
          <button
            onClick={handlePlayRandom}
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
            }`}
          >
            <Shuffle size={20} />
          </button>
          {/* Previous */}
          <button
            onClick={playPrevious}
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
            }`}
          >
            <SkipBack size={18} className="sm:w-5 sm:h-5" />
          </button>
          {/* Play/Pause */}
          <button

            onClick={() => isPlaying ? pauseSong() : resumeSong()}
            className={`p-2 sm:p-3 rounded-full ${
              isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isPlaying ? (
              <Pause size={20} className="sm:w-6 sm:h-6" />
            ) : (
              <Play size={20} className="sm:w-6 sm:h-6" />
            )}
=======
            onClick={() => isPlaying ? pause() : play(currentSong)}
            className={`p-3 rounded-full bg-blue-500 text-white ${
              isDark ? 'hover:bg-blue-600' : 'hover:bg-blue-600'
            }`}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}

          </button>
          {/* Next */}
          <button

            onClick={() => {}}
            className={`p-1.5 sm:p-2 rounded-full ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
=======
            onClick={playNext}
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
>
            }`}
          >
            <SkipForward size={18} className="sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleLike}
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${
              isLiked(currentSong.id)
                ? isDark
                  ? 'text-red-500 hover:text-red-400'
                  : 'text-red-600 hover:text-red-500'
                : isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Heart
              size={18}
              className={`sm:w-5 sm:h-5 ${isLiked(currentSong.id) ? 'fill-current' : ''}`}
            />
          </button>
          {/* Like */}
          <button
            onClick={handleToggleLike}
            className={`p-2 rounded-full ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
            } ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>
        {/* Progress Bar - Hidden on tablet for compactness */}
        <div className={`flex items-center gap-2 w-full ${isTablet ? 'hidden' : 'flex'}`}>
          <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className={`w-full h-1 rounded-lg appearance-none cursor-pointer ${
              isDark ? 'bg-gray-600' : 'bg-gray-300'
            }`}
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} ${(currentTime / (duration || 1)) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} 100%)`,
            }}
          />
          <span className="text-xs text-gray-500">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control - Hidden on tablet for compactness */}
      <div className={`flex items-center gap-2 ${isTablet ? 'hidden' : 'w-1/4 justify-end'}`}>
        <button
          onClick={() => setVolume(volume > 0 ? 0 : 0.5)} // Toggle mute/unmute or set to default volume
          className={`p-2 rounded-full ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'
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
          className={`w-24 h-1 rounded-lg appearance-none cursor-pointer ${
            isDark ? 'bg-gray-600' : 'bg-gray-300'
          }`}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(volume / 1) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} ${(volume / 1) * 100}%, ${isDark ? '#4b5563' : '#d1d5db'} 100%)`,
          }}
        />
      </div>
    </div>
  );
};