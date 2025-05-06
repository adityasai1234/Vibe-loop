import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Bell, Music, Home, Disc3 } from 'lucide-react';
import { checkActionCode } from 'firebase/auth';

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg border-b border-white/10 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="text-primary-500 mr-1">
            <Disc3 size={28} strokeWidth={2} />
          </div>
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            VibeLoop
          </Link>
          <span className="text-xs text-gray-400 ml-2">Powered by Spotify API</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-primary-400 transition-colors flex items-center">
            <Home size={18} className="mr-1" />
            <span>Home</span>
          </Link>
          <Link to="/discover" className="text-white hover:text-primary-400 transition-colors flex items-center">
            <Music size={18} className="mr-1" />
            <span>Discover</span>
          </Link>
          <Link to="/library" className="text-white hover:text-primary-400 transition-colors">
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
              className="bg-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 w-40 md:w-64"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <button className="text-white hover:text-primary-400 transition-colors p-2">
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
