import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SongCard } from '../components/SongCard';
import { PlaylistCard } from '../components/PlaylistCard';
import { songs } from '../data/songs';
import { playlists } from '../data/playlists';
import { users } from '../data/users';

export const HomePage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  // Get the current user (first user for demo)
  const currentUser = users[0];
  
  // Get recently played songs
  const recentlyPlayed = currentUser.recentlyPlayed.map(
    id => songs.find(song => song.id === id)
  ).filter(Boolean);
  
  // Get favorite songs
  const favoriteSongs = currentUser.favoriteSongs.map(
    id => songs.find(song => song.id === id)
  ).filter(Boolean);
  
  // Get trending songs (sort by likes)
  const trendingSongs = [...songs].sort((a, b) => b.likes - a.likes).slice(0, 5);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <div className={`pt-16 md:pl-60 pb-20 min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-white via-gray-100 to-white text-black'
    }`}>
      {/* Modified header with theme toggle */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-10 py-2">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <i className="fas fa-music text-2xl mr-2"></i>
            <h1 className="text-2xl font-bold">Vibe<span className="text-pink-300">Loop</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
            >
              {isDarkMode ? (
                <i className="fas fa-sun text-yellow-400"></i>
              ) : (
                <i className="fas fa-moon text-blue-400"></i>
              )}
            </button>
            <div className="flex items-center gap-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" 
                alt="Spotify" 
                className="h-6 w-6"
              />
              <span className="text-gray-400 text-sm">Powered by Spotify API</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recently Played</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200">
              View All
            </button>
          </div>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {recentlyPlayed.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  className="hover:shadow-xl transition-shadow duration-200"
                >
                  <SongCard song={song} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Playlists</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {playlists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {trendingSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Favorites</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favoriteSongs.map(song => song && (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};