import React from 'react';
import { Link } from 'react-router-dom';
import { useSongsStore, Song } from '../store/songsStore';
import { useThemeStore } from '../store/themeStore';
import { Play, Clock } from 'lucide-react';
import { useWindowSize } from '../hooks/useWindowSize';

export const HomePage: React.FC = () => {
  const { isDark } = useThemeStore();
  const { recentlyPlayed, playlists, songs } = useSongsStore();
  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < 640;
  const isTablet = width !== undefined && width >= 640 && width < 1024;

  const getSongById = (id: string) => songs.find((song: Song) => song.id === id);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pt-6 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome Back</h1>
        </div>

        {/* Recently Played */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Recently Played</h2>
            {recentlyPlayed.length > 0 && (
              <Link 
                to="/discover" 
                className={`text-sm font-medium ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                See All
              </Link>
            )}
          </div>
          
          {recentlyPlayed.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {recentlyPlayed.slice(0, isMobile ? 4 : isTablet ? 6 : 8).map((songId: string) => {
                const song = getSongById(songId);
                return song ? (
                  <Link to={`/discover?songId=${song.id}`} key={song.id} className="block">
                    <div className={`group relative p-2 sm:p-3 rounded-lg ${
                      isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                    } shadow-md transition-all duration-200`}>
                      <div className="relative">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-full aspect-square object-cover rounded-md mb-2"
                        />
                        <button className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Play size={16} />
                        </button>
                      </div>
                      <h3 className="font-medium truncate text-sm">{song.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                    </div>
                  </Link>
                ) : null;
              })}
            </div>
          ) : (
            <div className={`p-6 rounded-lg text-center ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <p className="text-gray-500">No songs recently played.</p>
            </div>
          )}
        </section>

        {/* Your Playlists */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Your Playlists</h2>
            {playlists.length > 0 && (
              <Link 
                to="/discover" 
                className={`text-sm font-medium ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                See All
              </Link>
            )}
          </div>

          {playlists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {playlists.map((playlist: { id: string; name: string; coverUrl: string; songs: string[]; }) => (
                <Link to={`/playlist/${playlist.id}`} key={playlist.id} className="block">
                  <div className={`group relative p-3 sm:p-4 rounded-lg ${
                    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                  } shadow-md transition-all duration-200`}>
                    <div className="relative">
                      <img
                        src={playlist.coverUrl}
                        alt={playlist.name}
                        className="w-full aspect-square object-cover rounded-md mb-3"
                      />
                      <button className="absolute bottom-3 right-3 p-2 rounded-full bg-blue-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Play size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold truncate text-base sm:text-lg mb-1">{playlist.name}</h3>
                    <p className="text-sm text-gray-500">{playlist.songs.length} songs</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`p-6 rounded-lg text-center ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <p className="text-gray-500">No playlists created yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};