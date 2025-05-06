import React, { useState } from 'react';
import { Filter, TrendingUp } from 'lucide-react';
import { SongCard } from '../components/SongCard';
import { songs } from '../data/songs';
import { useThemeStore } from '../store/themeStore';

export const DiscoverPage: React.FC = () => {
  const { isDark } = useThemeStore();
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  
  const genres = Array.from(new Set(songs.map(song => song.genre)));
  
  const filteredSongs = activeGenre 
    ? songs.filter(song => song.genre === activeGenre)
    : songs;
  
  return (
    <div className={`pt-16 md:pl-60 pb-20 min-h-screen ${
      isDark 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <div className="px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Find new music and artists you'll love
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <button className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${
                isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>
            
            <button className="flex items-center space-x-2 bg-primary-500/20 text-primary-400 rounded-full px-4 py-2 hover:bg-primary-500/30 transition-colors">
              <TrendingUp size={18} />
              <span>Trending</span>
            </button>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Browse Genres</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveGenre(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeGenre === null 
                  ? 'bg-primary-500 text-white' 
                  : isDark 
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            
            {genres.map(genre => (
              <button 
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeGenre === genre 
                    ? 'bg-primary-500 text-white' 
                    : isDark 
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {activeGenre ? `${activeGenre} Tracks` : 'All Tracks'}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};