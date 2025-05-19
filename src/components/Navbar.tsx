import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Music, Home, Disc3, Sun, Moon, TrendingUp, Library, LogOut, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuth } from '../context/AuthContext';
import { playlists } from '../data/playlists';
import { songs } from '../data/songs';
import { Song } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { SongCard } from './SongCard';

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();
  const { logout } = useAuth();
  
  // Load saved search query from localStorage on component mount
  useEffect(() => {
    const savedQuery = localStorage.getItem('vibeloop_search_query');
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  }, []);
  
  // Filter songs based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSongs([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const lowercaseQuery = searchQuery.toLowerCase();
    
    // Filter songs based on title, artist, or genre
    const results = songs.filter(song => 
      song.title.toLowerCase().includes(lowercaseQuery) ||
      song.artist.toLowerCase().includes(lowercaseQuery) ||
      song.genre.toLowerCase().includes(lowercaseQuery)
    );
    
    setFilteredSongs(results);
    
    // Save search query to localStorage
    localStorage.setItem('vibeloop_search_query', searchQuery);
  }, [searchQuery]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredSongs([]);
    localStorage.removeItem('vibeloop_search_query');
  };
  
  return (
    <nav className={`fixed top-0 w-full backdrop-blur-lg border-b z-50 transition-colors duration-300 ${
      isDark ? 'bg-black/80 border-white/10' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="text-primary-500 mr-1">
            <Disc3 size={28} strokeWidth={2} />
          </div>
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            VibeLoop
          </Link>
        </div>
        
        {/* Desktop navigation links - hidden on mobile */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`hover:text-primary-400 transition-colors flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Home size={18} className="mr-1" />
            <span>Home</span>
          </Link>
          <Link to="/discover" className={`hover:text-primary-400 transition-colors flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Music size={18} className="mr-1" />
            <span>Explore</span>
          </Link>
          <Link to="/categories" className={`hover:text-primary-400 transition-colors flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <TrendingUp size={18} className="mr-1" />
            <span>Categories</span>
          </Link>
          <Link to="/library" className={`hover:text-primary-400 transition-colors flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Library size={18} className="mr-1" />
            <span>Library</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Desktop search form */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for songs, artists, or genres"
                className={`rounded-full pl-10 pr-10 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 w-40 md:w-64 transition-all duration-300 ${
                  isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </form>
          
          {/* Mobile search button */}
          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className={`sm:hidden p-2 rounded-full transition-colors min-w-[40px] ${isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
            aria-label="Toggle search"
          >
            <Search size={20} />
          </button>
          
          {/* Theme toggle button with animation */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'
            }`}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? 
              <Sun size={20} className="transition-transform duration-300 rotate-0" /> : 
              <Moon size={20} className="transition-transform duration-300 rotate-0" />}
          </button>

          {/* Notification bell removed as requested */}
          
          {/* User profile link */}
          <Link to="/profile" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white transition-transform duration-300 hover:scale-110">
              <User size={16} />
            </div>
          </Link>
          
          {/* Logout button */}
          <button 
            onClick={logout}
            className={`hover:text-red-500 transition-colors p-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
      
      {/* Mobile search form - slides down when active */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full px-4 pb-4 ${isDark ? 'bg-black/80' : 'bg-white/80'}`}
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full mx-auto max-w-[300px]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search songs, artists, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search for songs, artists, or genres"
                  className={`w-full rounded-full pl-10 pr-10 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}
                  autoFocus
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search results */}
      <AnimatePresence>
        {searchQuery.trim() !== '' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-[60px] left-0 right-0 z-40 mx-auto max-w-4xl p-4 rounded-lg shadow-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          >
            <div className="max-h-[70vh] overflow-y-auto">
              {isSearching && filteredSongs.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mb-2"></div>
                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Searching...</p>
                  </div>
                </div>
              )}
              
              {!isSearching && filteredSongs.length === 0 && (
                <div className="text-center py-8">
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No songs found.</p>
                </div>
              )}
              
              {filteredSongs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredSongs.map(song => (
                    <SongCard key={song.id} song={song} />
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={clearSearch}
              className={`mt-4 w-full py-2 text-sm font-medium text-center rounded-md transition-colors duration-300 ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
            >
              Close Results
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
