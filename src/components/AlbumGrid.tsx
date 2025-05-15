import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../store/themeStore';

interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  audioSrc: string;
}

interface AlbumGridProps {
  albums: Album[];
  className?: string;
}

export const AlbumGrid: React.FC<AlbumGridProps> = ({ 
  albums,
  className = ''
}) => {
  const { isDark } = useThemeStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentlyPlayingRef = useRef<string | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audioElement = document.getElementById('audio-player') as HTMLAudioElement;
      if (audioElement) {
        audioRef.current = audioElement;
      }
    }
  }, []);
  
  // Handle click on album cover
  const handleAlbumClick = (album: Album) => {
    if (!audioRef.current) return;
    
    const selectedSrc = album.audioSrc;
    
    // Check if the same song is currently playing
    if (currentlyPlayingRef.current === selectedSrc) {
      // Toggle play/pause if it's the same song
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      // Play a new song
      audioRef.current.src = selectedSrc;
      audioRef.current.play();
      currentlyPlayingRef.current = selectedSrc;
    }
  };
  
  return (
    <div className={`album-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      
      {albums.map(album => (
        <div 
          key={album.id} 
          className={`album-item p-4 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-md transition-all duration-300 cursor-pointer`}
        >
          <div className="relative" onClick={() => handleAlbumClick(album)}>
            <img 
              src={album.coverArt} 
              alt={`${album.title} by ${album.artist}`}
              className="album-cover w-full aspect-square object-cover rounded-md mb-3"
              data-audio={album.audioSrc}
            />
            
            {/* Play/Pause indicator overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 rounded-md">
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-primary-500"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Now playing indicator */}
            {currentlyPlayingRef.current === album.audioSrc && !audioRef.current?.paused && (
              <div className="absolute bottom-0 left-0 right-0 bg-primary-500 text-white text-xs py-1 text-center">
                Now Playing
              </div>
            )}
          </div>
          
          <h3 className="font-medium text-lg">{album.title}</h3>
          <p className="text-sm opacity-75">{album.artist}</p>
        </div>
      ))}
    </div>
  );
};

export default AlbumGrid;