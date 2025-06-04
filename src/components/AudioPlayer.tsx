import { useAuthContext } from '../context/AuthContext';
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAudio } from '../context/AudioContext';

interface AudioPlayerProps {
  audioSrc: string;
  songTitle?: string;
  artist?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSrc,
  songTitle = 'Bohemian Rhapsody',
  artist = 'Queen'
}) => {
  const { isDark } = useThemeStore();
  const { isPlaying, currentSong, play, pause } = useAudio();
  
  // Check if this component's song is currently playing
  const isThisSongPlaying = isPlaying && currentSong === audioSrc;
  
  // Handle play button click
  const handlePlay = () => {
    play(audioSrc, songTitle, artist);
  };

  // Handle pause button click
  const handlePause = () => {
    pause();
  };

  return (
    <div className={`flex flex-col items-center p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handlePlay}
          disabled={isThisSongPlaying}
          className={`flex items-center justify-center px-4 py-2 rounded-md ${isDark ? 'bg-primary-600 hover:bg-primary-700' : 'bg-primary-500 hover:bg-primary-600'} text-white transition-colors ${isThisSongPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Play"
        >
          <Play size={20} className="mr-2" />
          <span>Play</span>
        </button>
        <button
          onClick={handlePause}
          disabled={!isThisSongPlaying}
          className={`flex items-center justify-center px-4 py-2 rounded-md ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${isDark ? 'text-white' : 'text-gray-800'} transition-colors ${!isThisSongPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Pause"
        >
          <Pause size={20} className="mr-2" />
          <span>Pause</span>
        </button>
      </div>
      
      {/* Status indicator */}
      {isThisSongPlaying && (
        <div className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'} flex items-center`}>
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Now playing: {songTitle} by {artist}
        </div>
      )}
      
      {/* We don't need a hidden audio player here since we're using the AudioContext */}
    </div>
  );
};

export default AudioPlayer;
