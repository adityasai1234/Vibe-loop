import React from 'react';
import { Search } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useSearch } from '../context/SearchContext';
import { useNavigate } from 'react-router-dom';

export const SearchBar: React.FC = () => {
  const { isDark } = useThemeStore();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // navigate('/discover');
    }
  };
  if (!searchQuery) {
    return null;
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists, or playlists..."
          className={`w-full px-4 py-2 pl-10 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2
            ${isDark 
              ? 'bg-secondary-800 text-secondary-100 placeholder-secondary-400 focus:ring-primary-600 focus:bg-secondary-700' 
              : 'bg-secondary-100 text-secondary-900 placeholder-secondary-500 focus:ring-primary-500 focus:bg-secondary-200'
          }`}
        />
        <Search 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
            isDark ? 'text-secondary-400' : 'text-secondary-500'
          }`} 
        />
      </div>
    </form>
  );
};