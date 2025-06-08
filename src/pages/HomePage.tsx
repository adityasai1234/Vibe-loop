import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/themeStore';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { songs } from '../data/songs';
import { Play, Pause, PlusCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useThemeStore();
  const { currentSong, isPlaying, play, pause, addToQueue } = useMusicPlayer();

  const handlePlay = (song: typeof songs[0]) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        pause();
      } else {
        play(song);
      }
    } else {
      play(song);
    }
  };

  const handleAddToQueue = (song: typeof songs[0]) => {
    addToQueue(song);
  };

  return (
    <div className={`p-8 transition-colors duration-300 ${
      isDark ? 'text-secondary-100' : 'text-secondary-900'
    }`}>
      <h1 className="text-3xl font-bold mb-4">Welcome to Vibe Loop</h1>
      <p className={`text-lg mb-8 ${
        isDark ? 'text-secondary-300' : 'text-secondary-700'
      }`}>
        Hello, {user?.email}! Start exploring music that matches your mood.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className={`group relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-secondary-900' : 'bg-white'
            }`}
          >
            <div className="aspect-square relative">
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-full h-full object-cover"
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
              <h3 className="font-semibold truncate text-lg">{song.title}</h3>
              <p className={`text-sm truncate ${
                isDark ? 'text-secondary-400' : 'text-secondary-600'
              }`}>
                {song.artist}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-secondary-800 text-secondary-300' : 'bg-secondary-100 text-secondary-600'
                }`}>
                  {song.genre}
                </span>
                <span className={`text-secondary-400' : 'text-secondary-500'}`}>
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                </span>
                <button
                  onClick={() => handleAddToQueue(song)}
                  className={`p-1 rounded-full transition-colors duration-200 ${
                    isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
                  }`}
                  title="Add to Queue"
                >
                  <PlusCircle size={20} className={isDark ? 'text-secondary-400' : 'text-secondary-500'} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};