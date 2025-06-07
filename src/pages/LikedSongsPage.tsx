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
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-20 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className={`p-4 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`}>
          <Heart className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Liked Songs</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {likedSongs.length} songs
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {likedSongs.map((song) => (
          <div
            key={song.id}
            className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{song.title}</h3>
              <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              {currentSong?.id === song.id && isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          </div>
        ))}

        {likedSongs.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No liked songs yet</p>
            <p className="text-sm">Songs you like will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}; 