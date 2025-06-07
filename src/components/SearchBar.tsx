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
      navigate('/discover');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search songs, artists, or playlists..."
          className={`w-full px-4 py-2 pl-10 rounded-full text-sm font-medium ${
            isDark 
              ? 'bg-gray-800 text-white placeholder-gray-400 focus:ring-gray-700' 
              : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-gray-200'
          } focus:outline-none focus:ring-2 transition-all duration-200`}
        />
        <Search 
          className={`absolute left-3 top-2.5 h-4 w-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} 
        />
      </div>
    </form>
  );
}; 