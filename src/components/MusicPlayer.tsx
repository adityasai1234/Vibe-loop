import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useThemeStore } from '../store/themeStore';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { currentSong, isPlaying, playSong, pauseSong, resumeSong } = useMusicPlayer();
  const { isDark } = useThemeStore();

  if (!currentSong) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-4 ${
      isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-12 h-12 rounded-md"
          />
          <div>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentSong.title}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {currentSong.artist}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {}}
            className={`p-2 rounded-full ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={() => isPlaying ? pauseSong() : resumeSong()}
            className={`p-3 rounded-full ${
              isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={() => {}}
            className={`p-2 rounded-full ${
              isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};