import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useThemeStore } from '../store/themeStore';
import { useLikedSongs } from '../context/LikedSongsContext';
import { Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = useMusicPlayer();
  const { isDark } = useThemeStore();
  const { isLiked, toggleLike } = useLikedSongs();

  if (!currentSong) return null;

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
        </div>

        {/* Controls - Center on mobile, right-aligned on desktop */}
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={() => {}}
            className={`p-1.5 sm:p-2 rounded-full ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <SkipBack size={18} className="sm:w-5 sm:h-5" />
          </button>

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
          </button>

          <button
            onClick={() => {}}
            className={`p-1.5 sm:p-2 rounded-full ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
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
        </div>
      </div>
    </div>
  );
};