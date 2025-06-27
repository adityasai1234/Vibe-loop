import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useThemeStore } from '../store/themeStore';
import { X } from 'lucide-react';

export const PlaybackQueue: React.FC = () => {
  const { queue, currentSong, removeFromQueue } = useMusicPlayer();
  const { isDark } = useThemeStore();

  if (queue.length === 0) {
    return (
      <div className={`p-4 rounded-lg ${
        isDark ? 'bg-secondary-800 text-secondary-400' : 'bg-secondary-100 text-secondary-600'
      }`}>
        <p className="text-center">Your playback queue is empty.</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg shadow-md overflow-hidden ${
      isDark ? 'bg-secondary-900' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${
        isDark ? 'text-secondary-100' : 'text-secondary-900'
      }`}>Playback Queue</h2>
      <ul className="space-y-3">
        {queue.map((song) => (
          <li
            key={song.id}
            className={`flex items-center p-3 rounded-md transition-colors duration-200 ${
              currentSong?.id === song.id
                ? isDark ? 'bg-primary-700 text-white dark:text-black' : 'bg-primary-100 text-primary-800 dark:text-black'
                : isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-50'
            }`}
          >
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-10 h-10 rounded-md mr-3 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate ${
                currentSong?.id === song.id
                  ? 'text-white dark:text-black'
                  : isDark ? 'text-secondary-200 dark:text-white' : 'text-secondary-800 dark:text-white'
              }`}>
                {song.title}
              </p>
              <p className={`text-sm truncate ${
                currentSong?.id === song.id
                  ? 'text-primary-100'
                  : isDark ? 'text-secondary-400' : 'text-secondary-600'
              }`}>
                {song.artist}
              </p>
            </div>
            <button
              onClick={() => removeFromQueue(song.id)}
              className={`ml-3 p-1 rounded-full transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-700' : 'hover:bg-secondary-200'
              }`}
            >
              <X size={16} className={isDark ? 'text-secondary-400' : 'text-secondary-500'} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}; 
