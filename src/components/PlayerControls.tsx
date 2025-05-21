import React, { useEffect, useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { usePlayerStore } from '../store/playerStore';

interface PlayerControlsProps {
  minimal?: boolean;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({ minimal = false }) => {
  const { 
    audioRef, 
    isPlaying, 
    currentTime, 
    duration, 
    formatTime,
    progress 
  } = useAudio();
  const { currentSong, togglePlayPause } = usePlayerStore();
  
  // Handle seeking when user interacts with progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current && duration > 0) {
      const seekTime = (parseFloat(e.target.value) / 100) * duration;
      audioRef.current.currentTime = seekTime;
    }
  };

  if (!currentSong) return null;

  return (
    <div className={`w-full ${minimal ? 'px-2' : 'px-4 py-2'} flex flex-col`}>
      {/* Song info */}
      {!minimal && (
        <div className="flex items-center mb-2">
          <img 
            src={currentSong.albumArt} 
            alt={currentSong.title}
            className="w-10 h-10 rounded mr-3"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{currentSong.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
          </div>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="flex-1 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${progress}%, #e5e7eb ${progress}%, #e5e7eb 100%)`
          }}
        />
        <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
      </div>
      
      {/* Play/Pause button */}
      {!minimal && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => togglePlayPause()}
            className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-md hover:bg-primary-600 active:bg-primary-700 transition-colors"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
