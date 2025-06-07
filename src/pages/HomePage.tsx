import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/themeStore';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { songs } from '../data/songs';
import { Play, Pause } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useThemeStore();
  const { currentSong, isPlaying, playSong, pauseSong } = useMusicPlayer();

  const handlePlay = (song: typeof songs[0]) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong(song);
      }
    } else {
      playSong(song);
    }
  };

  return (
    <div className={`p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">Welcome to Vibe Loop</h1>
      <p className="text-lg mb-8">
        Hello, {user?.email}! Start exploring music that matches your mood.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className={`group relative rounded-lg overflow-hidden ${
              isDark ? 'bg-gray-800' : 'bg-white'
            } shadow-md transition-transform hover:scale-102 hover:shadow-lg`}
          >
            <div className="aspect-square relative">
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <button
                onClick={() => handlePlay(song)}
                className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  isDark ? 'text-white' : 'text-white'
                }`}
              >
                {currentSong?.id === song.id && isPlaying ? (
                  <Pause size={48} />
                ) : (
                  <Play size={48} />
                )}
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate text-base">{song.title}</h3>
              <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {song.artist}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {song.genre}
                </span>
                <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};