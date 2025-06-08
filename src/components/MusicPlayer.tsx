import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useThemeStore } from '../store/themeStore';
import { useLikedSongs } from '../context/LikedSongsContext';
import { Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';
import { Song } from '../store/songsStore';

export const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, play, pause, duration, currentTime, setVolume, seek, playNext, playPrevious, volume } = useMusicPlayer();
  const { isDark } = useThemeStore();
  const { isLiked, toggleLike } = useLikedSongs();

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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    seek(time);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-4 sm:p-6 shadow-lg transition-colors duration-300 ${
      isDark ? 'bg-secondary-950 border-t border-secondary-800' : 'bg-white border-t border-secondary-200'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Song Info */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-12 h-12 rounded-md shadow-md"
          />
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold text-lg truncate ${
              isDark ? 'text-secondary-100' : 'text-secondary-900'
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
              onClick={playPrevious}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              }`}
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={() => isPlaying ? pause() : play(currentSong)}
              className={`p-3 rounded-full shadow-md transition-colors duration-200 ${
                isDark ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {isPlaying ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
            </button>

            <button
              onClick={playNext}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              }`}
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center w-full max-w-xl space-x-2 text-sm">
            <span className={isDark ? 'text-secondary-400' : 'text-secondary-600'}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer group-hover:opacity-100 transition-opacity duration-200 ${
                isDark ? 'bg-secondary-700' : 'bg-secondary-300'
              } accent-primary-500`}
            />
            <span className={isDark ? 'text-secondary-400' : 'text-secondary-600'}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right section (Like button) */}
        <div className="flex items-center w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isLiked(currentSong.id)
                ? isDark
                  ? 'text-accent-500 hover:text-accent-400'
                  : 'text-accent-600 hover:text-accent-500'
                : isDark
                ? 'text-secondary-400 hover:text-secondary-100'
                : 'text-secondary-500 hover:text-secondary-800'
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