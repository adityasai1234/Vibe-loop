import React from 'react';
import { Link } from 'react-router-dom';
import { useSongsStore } from '../store/songsStore';
import { useThemeStore } from '../store/themeStore';
import { Play, Clock } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { isDark } = useThemeStore();
  const { songs, playlists, recentlyPlayed } = useSongsStore();

  const getSongById = (id: string) => songs.find(song => song.id === id);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Welcome Back</h1>

      {/* Recently Played */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={24} />
          <h2 className="text-2xl font-semibold">Recently Played</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentlyPlayed.slice(0, 8).map((songId) => {
            const song = getSongById(songId);
            if (!song) return null;
            return (
              <div
                key={song.id}
                className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                } shadow-md transition-colors`}
              >
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold truncate">{song.title}</h3>
                <p className="text-sm text-gray-500 truncate">{song.artist}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Playlists */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Play size={24} />
          <h2 className="text-2xl font-semibold">Your Playlists</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } shadow-md transition-colors`}
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-full aspect-square object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold truncate">{playlist.name}</h3>
              <p className="text-sm text-gray-500">{playlist.songs.length} songs</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};