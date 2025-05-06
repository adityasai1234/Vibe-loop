import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Bell, Music, Home, Disc3, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme } = useThemeStore();
  
  return (
    <nav className={`fixed top-0 w-full backdrop-blur-lg border-b z-50 ${
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
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`hover:text-primary-400 transition-colors flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Home size={18} className="mr-1" />
            <span>Home</span>
          </Link>
          <Link to="/discover" className={`hover:text-primary-400 transition-colors flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Music size={18} className="mr-1" />
            <span>Discover</span>
          </Link>
          <Link to="/library" className={`hover:text-primary-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Library
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`rounded-full pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 w-40 md:w-64 ${
                isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
              }`}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className={`hover:text-primary-400 transition-colors p-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <Bell size={20} />
          </button>
          
          <Link to="/profile" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white">
              <User size={16} />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};