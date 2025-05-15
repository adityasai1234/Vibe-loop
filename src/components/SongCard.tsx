import React from 'react';
import { Play, Heart, MoreHorizontal, Pause, JapaneseYenIcon, CheckCircle2 } from 'lucide-react';
import { Song } from '../types';
import { usePlayerStore } from '../store/playerStore';
import { useAudio } from '../context/AudioContext';
import { browserPopupRedirectResolver } from 'firebase/auth';

interface SongCardProps {
  song: Song;
  size?: 'small' | 'medium' | 'large';
}

export const SongCard: React.FC<SongCardProps> = ({ song, size = 'medium' }) => {
  const { currentSong, isPlaying, setCurrentSong, togglePlayPause } = usePlayerStore();
  const { play: playAudio, pause: pauseAudio } = useAudio();
  
  const isActive = currentSong?.id === song.id;
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isActive) {
      if (isPlaying) {
        pauseAudio();
      } else {
        // Resume playing the current song
        const songUrl = song.audioUrl || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${song.id}_audio.mp3`;
        playAudio(songUrl, song.title, song.artist);
      }
      togglePlayPause();
    } else {
      // Play a new song
      const songUrl = song.audioUrl || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${song.id}_audio.mp3`;
      playAudio(songUrl, song.title, song.artist);
      setCurrentSong(song);
    }
  };
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Sizing classes - improved for responsive design
  const containerClasses = {
    small: 'flex items-center space-x-3 p-2 hover:bg-gray-100/10',
    medium: 'flex flex-col w-full p-3 group',
    large: 'flex flex-col w-full p-4 group'
  };
  
  const imageClasses = {
    small: 'w-10 h-10 rounded',
    medium: 'w-full aspect-square rounded-md mb-2 sm:mb-3 object-cover',
    large: 'w-full aspect-square rounded-lg mb-3 sm:mb-4 object-cover'
  };
  
  if (size === 'small') {
    return (
      <div className={`${containerClasses[size]} rounded-md transition-all hover:bg-gray-100/10`}>
        <img 
          src={song.albumArt} 
          alt={`${song.title} by ${song.artist}`} 
          className={imageClasses[size]}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{song.title}</p>
          <p className="text-xs text-gray-400 truncate">{song.artist}</p>
        </div>
        <button 
          onClick={handlePlay}
          className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white transition-all shadow-md active:shadow-sm active:scale-95"
        >
          {isActive && isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
    );
  }
  
  return (
    <div className={`${containerClasses[size]} rounded-lg transition-all hover:bg-gray-100/5`}>
      <div className="relative">
        <img 
          src={song.albumArt} 
          alt={`${song.title} by ${song.artist}`} 
          className={`${imageClasses[size]} transition-all group-hover:shadow-lg group-hover:shadow-primary-500/20`}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-black/40 rounded-md"></div>
          <button 
            onClick={handlePlay}
            className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {isActive && isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
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
