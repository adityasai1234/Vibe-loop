import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Compass, Library, Bookmark, Heart, Clock, Plus, 
  Mic, Radio, Headphones
} from 'lucide-react';
import { playlists } from '../data/playlists';
import { useThemeStore } from '../store/themeStore';

export const Sidebar: React.FC = () => {
  const { isDark } = useThemeStore();
  
  return (
    <aside className={`hidden md:flex fixed left-0 top-16 bottom-20 w-60 backdrop-blur-lg border-r flex-col z-40 ${
      isDark ? 'bg-black/80 border-white/10 text-white' : 'bg-white/80 border-gray-200 text-gray-900'
    }`}>
      <div className="p-4">
        <h2 className={`font-semibold mb-3 ${isDark ? 'text-white/80' : 'text-gray-900/80'}`}>MENU</h2>
        <ul className="space-y-1">
          <li>
            <Link to="/" className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}>
              <Home size={18} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/discover" className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}>
              <Compass size={18} />
              <span>Discover</span>
            </Link>
          </li>
          <li>
            <Link to="/library" className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}>
              <Library size={18} />
              <span>Your Library</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <h2 className={`font-semibold mb-3 ${isDark ? 'text-white/80' : 'text-gray-900/80'}`}>YOUR COLLECTION</h2>
        <ul className="space-y-1">
          <li>
            <Link to="/liked" className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}>
              <Heart size={18} />
              <span>Liked Songs</span>
            </Link>
          </li>
          <li>
            <Link to="/favorites" className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}>
              <Bookmark size={18} />
              <span>Favorites</span>
            </Link>
          </li>
          <li>
            <Link to="/recent" className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}>
              <Clock size={18} />
              <span>Recently Played</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-semibold ${isDark ? 'text-white/80' : 'text-gray-900/80'}`}>YOUR PLAYLISTS</h2>
          <button className={`p-1 rounded-md transition-colors ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
          }`}>
            <Plus size={18} />
          </button>
        </div>
        <ul className="space-y-1">
          {playlists.map(playlist => (
            <li key={playlist.id}>
              <Link 
                to={`/playlist/${playlist.id}`} 
                className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <img 
                  src={playlist.coverArt} 
                  alt={playlist.title} 
                  className="w-6 h-6 rounded object-cover"
                />
                <span className="truncate">{playlist.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className={`mt-auto p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <h2 className={`font-semibold mb-3 ${isDark ? 'text-white/80' : 'text-gray-900/80'}`}>CATEGORIES</h2>
        <div className="grid grid-cols-2 gap-2">
          <button className={`flex items-center justify-center space-x-2 p-2 rounded-md transition-colors ${
            isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <Headphones size={16} />
            <span className="text-sm">Pop</span>
          </button>
          <button className={`flex items-center justify-center space-x-2 p-2 rounded-md transition-colors ${
            isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <Radio size={16} />
            <span className="text-sm">Rock</span>
          </button>
          <button className={`flex items-center justify-center space-x-2 p-2 rounded-md transition-colors ${
            isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <Mic size={16} />
            <span className="text-sm">Hip Hop</span>
          </button>
          <button className={`flex items-center justify-center space-x-2 p-2 rounded-md transition-colors ${
            isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <Headphones size={16} />
            <span className="text-sm">Indie</span>
          </button>
        </div>
      </div>
    </aside>
  );
};