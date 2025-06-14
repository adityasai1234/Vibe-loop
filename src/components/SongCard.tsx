import React from 'react';
import { Play, Heart, MoreHorizontal, Pause, Square } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import type { Song } from '../store/songsStore';

interface SongCardProps {
  song: Song;
  size?: 'small' | 'medium' | 'large';
}

export const SongCard: React.FC<SongCardProps> = ({ song, size = 'medium' }) => {
  const { currentSong, isPlaying, play, pause } = useMusicPlayer();
  const [lastClickTime, setLastClickTime] = React.useState<number>(0);
  
  const isActive = currentSong?.id === song.id;
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    
    if (isActive) {
      if (isPlaying && now - lastClickTime < 300) {
        pause();
        setLastClickTime(0);
      } else {
        pause();
        setLastClickTime(now);
      }
    } else {
      play(song);
      setLastClickTime(now);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive && isPlaying) {
      pause();
    }
  };
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Sizing classes
  const containerClasses = {
    small: 'flex items-center space-x-3 p-2 hover:bg-gray-100/10',
    medium: 'flex flex-col w-48 p-3 group',
    large: 'flex flex-col w-64 p-4 group'
  };
  
  const imageClasses = {
    small: 'w-10 h-10 rounded',
    medium: 'w-full aspect-square rounded-md mb-3 object-cover',
    large: 'w-full aspect-square rounded-lg mb-4 object-cover'
  };
  
  if (size === 'small') {
    return (
      <div className={`${containerClasses[size]} rounded-md transition-all hover:bg-gray-100/10`}>
        <img 
          src={song.coverUrl} 
          alt={`${song.title} by ${song.artist}`} 
          className={imageClasses[size]}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{song.title}</p>
          <p className="text-xs text-gray-400 truncate">{song.artist}</p>
        </div>
        <div className="flex items-center space-x-2">
          {isActive && isPlaying && (
            <button 
              onClick={handleStop}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
              title="Stop"
            >
              <Square size={16} />
            </button>
          )}
        <button 
          onClick={handlePlay}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all"
            title={isActive && isPlaying ? "Double click to stop" : "Play"}
        >
          {isActive && isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${containerClasses[size]} rounded-lg transition-all hover:bg-gray-100/5`}>
      <div className="relative">
        <img 
          src={song.coverUrl} 
          alt={`${song.title} by ${song.artist}`} 
          className={`${imageClasses[size]} transition-all group-hover:shadow-lg group-hover:shadow-primary-500/20`}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-black/40 rounded-md"></div>
          <div className="relative z-10 flex items-center space-x-2">
            {isActive && isPlaying && (
              <button 
                onClick={handleStop}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-all transform hover:scale-105"
                title="Stop"
              >
                <Square size={24} />
              </button>
            )}
          <button 
            onClick={handlePlay}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all transform hover:scale-105"
              title={isActive && isPlaying ? "Double click to stop" : "Play"}
          >
              {isActive && isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-2">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">{song.title}</p>
          <Heart size={16} className="text-gray-400 hover:text-accent-500 cursor-pointer" />
        </div>
        <p className="text-sm text-gray-400">{song.artist}</p>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
          <span>{formatDuration(song.duration)}</span>
          <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};