import React from 'react';
import { useLikedSongs } from '../context/LikedSongsContext';
import { Heart, Play, Pause } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const LikedSongsPage: React.FC = () => {
  const { likedSongs, loading } = useLikedSongs();
  const { isDark } = useThemeStore();
  const { currentSong, isPlaying, playSong, pauseSong } = useMusicPlayer();

  if (loading) {
    return (
      <div className="p-8 transition-colors duration-300">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-20 rounded-lg ${
              isDark ? 'bg-secondary-800' : 'bg-secondary-200'
            }`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-8 transition-colors duration-300 ${
      isDark ? 'text-secondary-100' : 'text-secondary-900'
    }`}>
      <div className="flex items-center space-x-4 mb-8">
        <div className={`p-4 rounded-full shadow-md ${
          isDark ? 'bg-primary-600' : 'bg-primary-500'
        }`}>
          <Heart className={`w-8 h-8 ${isDark ? 'text-white' : 'text-black'}`} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Liked Songs</h1>
          <p className={`text-lg ${
            isDark ? 'text-secondary-400' : 'text-secondary-600'
          }`}>
            {likedSongs.length} songs
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {likedSongs.map((song) => (
          <div
            key={song.id}
            className={`flex items-center space-x-4 p-4 rounded-lg shadow-sm transition-colors duration-200 ${
              isDark ? 'bg-secondary-900 hover:bg-secondary-800' : 'bg-white hover:bg-secondary-100'
            }`}
          >
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-14 h-14 rounded-md object-cover shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate text-lg">{song.title}</h3>
              <p className={`text-sm truncate ${
                isDark ? 'text-secondary-400' : 'text-secondary-600'
              }`}>
                {song.artist}
              </p>
            </div>
            <button
              onClick={() => {
                if (currentSong?.id === song.id && isPlaying) {
                  pauseSong();
                } else {
                  playSong(song);
                }
              }}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              }`}
            >
              {currentSong?.id === song.id && isPlaying ? (
                <Pause size={24} className={`transition-colors duration-200 ${
                  isDark ? 'text-primary-400' : 'text-primary-600'
                }`} />
              ) : (
                <Play size={24} className={`transition-colors duration-200 ${
                  isDark ? 'text-primary-400' : 'text-primary-600'
                }`} />
              )}
            </button>
          </div>
        ))}

        {likedSongs.length === 0 && (
          <div className={`text-center py-16 transition-colors duration-200 ${
            isDark ? 'text-secondary-400' : 'text-secondary-600'}
          `}>
            <Heart size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-xl font-semibold mb-2">No liked songs yet</p>
            <p className="text-md">Songs you like will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}; 
