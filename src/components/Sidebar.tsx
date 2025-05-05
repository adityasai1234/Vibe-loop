import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Compass, Library, Bookmark, Heart, Clock, Plus, 
  Mic, Radio, Headphones
} from 'lucide-react';
import { playlists } from '../data/playlists';

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex fixed left-0 top-16 bottom-20 w-60 bg-black/80 backdrop-blur-lg border-r border-white/10 flex-col text-white z-40">
      <div className="p-4">
        <h2 className="font-semibold mb-3 text-white/80">MENU</h2>
        <ul className="space-y-1">
          <li>
            <Link to="/" className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors">
              <Home size={18} />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/discover" className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors">
              <Compass size={18} />
              <span>Discover</span>
            </Link>
          </li>
          <li>
            <Link to="/library" className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors">
              <Library size={18} />
              <span>Your Library</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <h2 className="font-semibold mb-3 text-white/80">YOUR COLLECTION</h2>
        <ul className="space-y-1">
          <li>
            <Link to="/liked" className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors">
              <Heart size={18} />
              <span>Liked Songs</span>
            </Link>
          </li>
          <li>
            <Link to="/favorites" className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors">
              <Bookmark size={18} />
              <span>Favorites</span>
            </Link>
          </li>
          <li>
            <Link to="/recent" className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors">
              <Clock size={18} />
              <span>Recently Played</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white/80">YOUR PLAYLISTS</h2>
          <button className="p-1 rounded-md hover:bg-white/10 transition-colors">
            <Plus size={18} />
          </button>
        </div>
        <ul className="space-y-1">
          {playlists.map(playlist => (
            <li key={playlist.id}>
              <Link 
                to={`/playlist/${playlist.id}`} 
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 transition-colors"
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
      
      <div className="mt-auto p-4 border-t border-white/10">
        <h2 className="font-semibold mb-3 text-white/80">CATEGORIES</h2>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
            <Headphones size={16} />
            <span className="text-sm">Pop</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
            <Radio size={16} />
            <span className="text-sm">Rock</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
            <Mic size={16} />
            <span className="text-sm">Hip Hop</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors">
            <Headphones size={16} />
            <span className="text-sm">Indie</span>
          </button>
        </div>
      </div>
    </aside>
  );
};