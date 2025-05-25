import React, { useState, useEffect } from 'react';
import { songs } from '../data/songs';
import { SongCard } from '../components/SongCard';
import { Search, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

// Custom debounce hook for better search performance
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const CategoryPage: React.FC = () => {
  const { isDark } = useThemeStore();
  const [query, setQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState(songs);
  
  // Use debounced query for better performance
  const debouncedQuery = useDebounce(query, 300);

  // Filter songs based on debounced search query
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setFilteredSongs(songs);
      return;
    }

    const lowercaseQuery = debouncedQuery.toLowerCase();
    const results = songs.filter(song => 
      song.title.toLowerCase().includes(lowercaseQuery) ||
      song.artist.toLowerCase().includes(lowercaseQuery) ||
      song.genre.toLowerCase().includes(lowercaseQuery)
    );

    setFilteredSongs(results);
  }, [debouncedQuery]);

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Clear search input
  const handleClearSearch = () => {
    setQuery('');
  };

  return (
    <div className={`pt-16 md:pt-16 md:pl-60 pb-20 min-h-screen w-full transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Music Categories</h1>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search songs, artists, or genres..."
                className={`w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isDark ? 'bg-gray-800/50 border border-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-900 shadow-sm'}`}
              />
              
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Song Results */}
        <div className="mt-8">
          {filteredSongs.length > 0 ? (
            <>
              <p className="text-sm mb-4 text-gray-500">
                {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredSongs.map(song => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No songs found</h2>
              <p className={`max-w-lg mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Try searching for a different title, artist, or genre.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;