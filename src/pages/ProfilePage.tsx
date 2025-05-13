import React from 'react';
import { Edit, Share2, Users, Music, ListMusic, ClipboardCheckIcon } from 'lucide-react';
import { SongCard } from '../components/SongCard';
import { users } from '../data/users';
import { songs } from '../data/songs';
import { playlists } from '../data/playlists';
import { PlaylistCard } from '../components/PlaylistCard';
import { useThemeStore } from '../store/themeStore';

export const ProfilePage: React.FC = () => {
  const { isDark } = useThemeStore();
  const currentUser = users[0];
  
  const favoriteSongs = currentUser.favoriteSongs.map(
    id => songs.find(song => song.id === id)
  ).filter(Boolean);
  
  const userPlaylists = playlists.filter(playlist => playlist.createdBy === currentUser.id);
  
  const recentlyPlayed = currentUser.recentlyPlayed.map(
    id => songs.find(song => song.id === id)
  ).filter(Boolean);
  
  return (
    <div className={`pt-16 md:pl-60 pb-20 min-h-screen ${
      isDark 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-primary-900/60 to-accent-900/60"></div>
        
        <div className="absolute -bottom-16 left-0 w-full px-6 flex flex-col md:flex-row items-start md:items-end">
          <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden">
            <img 
              src={currentUser.profilePic} 
              alt={currentUser.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-4 md:mb-2">
            <h1 className="text-3xl font-bold">{currentUser.name}</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>@{currentUser.username}</p>
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0 md:ml-auto md:mb-2">
            <button className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${
              isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
            }`}>
              
              <Edit size={18} />
              <span>Edit Profile</span>
            </button>
            <button className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${
              isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
            }`}>
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6 pt-24 pb-8">
        <div className="flex flex-wrap gap-8 mb-10">
          <div className="flex items-center space-x-2">
            <Users size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {currentUser.followers} Followers
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {currentUser.following} Following
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Music size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {favoriteSongs.length} Favorite Songs
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ListMusic size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {userPlaylists.length} Playlists
            </span>
          </div>
        </div>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Playlists</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {userPlaylists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Favorite Songs</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favoriteSongs.map(song => song && (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recently Played</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {recentlyPlayed.map(song => song && (
              <SongCard key={song.id} song={song} size="small" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};