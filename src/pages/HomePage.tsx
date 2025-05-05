import React from 'react';
import { SongCard } from '../components/SongCard';
import { PlaylistCard } from '../components/PlaylistCard';
import { songs } from '../data/songs';
import { playlists } from '../data/playlists';
import { users } from '../data/users';

export const HomePage: React.FC = () => {
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
  
  return (
    <div className="pt-16 md:pl-60 pb-20 min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="px-6 py-8">
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recently Played</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentlyPlayed.map(song => song && (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
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