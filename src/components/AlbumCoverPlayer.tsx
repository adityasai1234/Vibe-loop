import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface AlbumCoverPlayerProps {
  audioSrc: string;
  coverArt: string;
  songTitle: string;
  artist: string;
  className?: string;
  showPlayIcon?: boolean;
}

export const AlbumCoverPlayer: React.FC<AlbumCoverPlayerProps> = ({
  audioSrc,
  coverArt,
  songTitle,
  artist,
  className = '',
  showPlayIcon = true
}) => {
  const { isPlaying, currentSong, play, pause } = useAudio();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if this component's song is currently playing
  const isThisSongPlaying = isPlaying && currentSong === audioSrc;
  
  // Handle click on album cover
  const handleClick = async () => {
    if (isThisSongPlaying) {
      // If this song is playing, pause it
      pause();
    } else {
      // If this song is not playing, play it
      setIsLoading(true);
      setError(null);
      
      try {
        await play(audioSrc, songTitle, artist);
      } catch (err) {
        console.error('Error playing audio:', err);
        setError('Failed to play audio');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Use Spider-Man mask image for Sunflower song
  const finalCoverArt = songTitle.toLowerCase() === 'sunflower' 
    ? '/assets/images/spiderman-mask.svg' // Use the Spider-Man mask SVG image
    : coverArt;
    
  return (
    <div 
      className={`album-cover-player relative cursor-pointer ${className}`}
      onClick={handleClick}
      aria-label={isThisSongPlaying ? `Pause ${songTitle} by ${artist}` : `Play ${songTitle} by ${artist}`}
    >
      <img 
        src={finalCoverArt} 
        alt={`${songTitle} by ${artist}`}
        className="w-full h-full object-cover rounded-lg transition-transform hover:scale-105 duration-300"
      />
      
      {/* Play/Pause Overlay */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
          <div className="bg-white/90 p-3 rounded-full">
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            ) : isThisSongPlaying ? (
              <Pause size={24} className="text-primary-500" />
            ) : (
              <Play size={24} className="text-primary-500 ml-1" />
            )}
          </div>
        </div>
      )}
      
      {/* Now Playing Indicator */}
      {isThisSongPlaying && (
        <div className="absolute bottom-0 left-0 right-0 bg-primary-500 text-white text-xs py-1 px-2 text-center">
          Now Playing
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs py-1 px-2 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default AlbumCoverPlayer;