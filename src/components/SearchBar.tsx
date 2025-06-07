import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useSongsStore } from '../store/songsStore';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Play, Heart } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const { isDark } = useThemeStore();
  const { songs, likedSongs, toggleLike } = useSongsStore();
  const { currentSong, isPlaying, play, pause } = useMusicPlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredSongs = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return songs.filter(song => 
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.album.toLowerCase().includes(query) ||
      song.genre.toLowerCase().includes(query)
    );
  }, [songs, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Additional search logic can be added here
  };

  const handleSongClick = (song: any) => {
    if (currentSong?.id === song.id) {
      isPlaying ? pause() : play(song);
    } else {
      play(song);
    }
  };

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-full ${
          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
        }`}
      >
        <Search size={20} />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className={`relative w-full max-w-2xl rounded-lg shadow-lg ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            {/* Search Header */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search songs, artists, or albums..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                      isDark 
                        ? 'bg-gray-800 text-white placeholder-gray-400' 
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </form>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {filteredSongs.length > 0 ? (
                <div className="space-y-4">
                  {filteredSongs.map((song) => (
                    <div
                      key={song.id}
                      className={`flex items-center gap-4 p-2 rounded-lg ${
                        isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      } transition-colors duration-200`}
                    >
                      {/* Album Cover - Clickable */}
                      <div 
                        onClick={() => handleSongClick(song)}
                        className="relative group cursor-pointer"
                      >
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-12 h-12 rounded-md object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-md transition-opacity duration-200 flex items-center justify-center">
                          <Play 
                            size={24} 
                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          />
                        </div>
                      </div>

                      {/* Song Details - Clickable */}
                      <div 
                        onClick={() => handleSongClick(song)}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <h3 className="font-medium truncate hover:text-blue-500 transition-colors duration-200">
                          {song.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {song.artist}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSongClick(song)}
                          className={`p-2 rounded-full ${
                            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                          } transition-colors duration-200`}
                        >
                          <Play size={20} />
                        </button>
                        <button
                          onClick={() => toggleLike(song.id)}
                          className={`p-2 rounded-full ${
                            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                          } ${likedSongs.includes(song.id) ? 'text-red-500' : ''} transition-colors duration-200`}
                        >
                          <Heart 
                            size={20} 
                            fill={likedSongs.includes(song.id) ? 'currentColor' : 'none'}
                            className={likedSongs.includes(song.id) ? 'animate-heartBeat' : ''}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// CSS for heart beat animation
const styles = `
@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);        
  }
  50% {
    transform: scale(1.2);
  }
}

.animate-heartBeat {
  animation: heartBeat 0.6s ease-in-out infinite;
}
`;
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  if (document.querySelector('.animate-heartBeat')) {
    document.querySelector('.animate-heartBeat')?.classList.add('animate-heartBeat');
}
  }
export default SearchBar;
