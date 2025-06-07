import React from 'react';
import { useParams } from 'react-router-dom';
import { useSongsStore, Song } from '../store/songsStore';
import { useThemeStore } from '../store/themeStore';
import { Play, Pause, Heart, Clock } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { playlists, songs, likedSongs, toggleLike, addToRecentlyPlayed } = useSongsStore();
  const { isDark } = useThemeStore();
  const { currentSong, isPlaying, play, pause } = useMusicPlayer();

  const playlist = playlists.find((p) => p.id === id);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!playlist) {
    return (
      <div className={`min-h-screen p-8 pt-20 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Playlist not found</h1>
          <p className="text-lg text-gray-500">The playlist you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  const playlistSongs: Song[] = playlist.songs.map((songId) => songs.find((s) => s.id === songId)).filter((s): s is Song => Boolean(s));

  const handleSongPlay = (song: Song) => {
    if (currentSong?.id === song.id) {
      isPlaying ? pause() : play(song);
    } else {
      play(song);
      addToRecentlyPlayed(song.id);
    }
  };

  return (
    <div className={`min-h-screen p-8 pt-20 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Playlist Header */}
        <div className={`flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 p-6 rounded-lg ${
          isDark ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-32 h-32 md:w-48 md:h-48 rounded-lg shadow-md object-cover"
          />
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 font-semibold mb-1">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">{playlist.name}</h1>
            <p className="text-lg text-gray-500">{playlistSongs.length} songs</p>
          </div>
        </div>

        {/* Song List */}
        <div className={`overflow-x-auto rounded-lg shadow-md ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <table className="min-w-full divide-y divide-gray-700">
            <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Album</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"><Clock size={16} /></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {playlistSongs.map((song, index) => (
                <tr
                  key={song.id}
                  className={`hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200 cursor-pointer ${
                    currentSong?.id === song.id ? (isDark ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-100 bg-opacity-50') : ''
                  }`}
                  onClick={() => handleSongPlay(song)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded-md object-cover mr-4" />
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-white">{song.title}</div>
                        <div className="text-sm text-gray-500">{song.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{song.album}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{formatDuration(song.duration)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering twice
                        toggleLike(song.id);
                      }}
                      className={`p-2 rounded-full ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      } ${likedSongs.includes(song.id) ? 'text-red-500' : ''}`}
                    >
                      <Heart size={20} fill={likedSongs.includes(song.id) ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 