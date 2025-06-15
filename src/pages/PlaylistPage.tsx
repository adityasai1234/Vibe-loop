import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSongsStore, Song } from '../store/songsStore';
import { usePlaylistStore } from '../store/playlistStore';
import { useThemeStore } from '../store/themeStore';
import { Play, Pause, Heart, Clock, MoreVertical, Share2, Edit2, Trash2, Share } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { PlaylistModal } from '../components/PlaylistModal';
import { SharePlaylistModal } from '../components/SharePlaylistModal';
import { DroppablePlaylist } from '../components/DroppablePlaylist';
import { Playlist } from '../types';

export const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playlists, songs, likedSongs, toggleLike, addToRecentlyPlayed } = useSongsStore();
  const { deletePlaylist } = usePlaylistStore();
  const { isDark } = useThemeStore();
  const { currentSong, isPlaying, play, pause } = useMusicPlayer();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const playlist = playlists.find((p) => p.id === id);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom });
    setIsMenuOpen(true);
  };

  const handleDeletePlaylist = () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(id!);
      navigate('/');
    }
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
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen p-8 pt-20 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Playlist Header */}
          <div className={`flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 p-6 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-lg relative`}>
            <img
              src={playlist.coverArt}
              alt={playlist.title}
              className="w-32 h-32 md:w-48 md:h-48 rounded-lg shadow-md object-cover"
            />
            <div className="text-center md:text-left flex-1">
              <p className="text-sm text-gray-500 font-semibold mb-1">Playlist</p>
              <h1 className="text-4xl md:text-6xl font-bold mb-2">{playlist.title}</h1>
              <p className="text-lg text-gray-500">{playlistSongs.length} songs</p>
            </div>

            {/* Playlist Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className={`p-2 rounded-full ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Share playlist"
              >
                <Share2 size={20} />
              </button>
              <div className="relative">
                <button
                  onClick={handleMenuClick}
                  className={`p-2 rounded-full ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  title="More options"
                >
                  <MoreVertical size={20} />
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div
                      className={`absolute z-50 mt-2 w-48 rounded-md shadow-lg ${
                        isDark ? 'bg-gray-800' : 'bg-white'
                      } ring-1 ring-black ring-opacity-5`}
                      style={{
                        top: menuPosition.y,
                        left: menuPosition.x,
                        transform: 'translateX(-100%)',
                      }}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsEditModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center w-full px-4 py-2 text-sm ${
                            isDark
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Edit2 size={16} className="mr-3" />
                          Edit Playlist
                        </button>
                        <button
                          onClick={() => {
                            setIsShareModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center w-full px-4 py-2 text-sm ${
                            isDark
                              ? 'text-gray-300 hover:bg-gray-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Share size={16} className="mr-3" />
                          Share
                        </button>
                        <button
                          onClick={() => {
                            handleDeletePlaylist();
                            setIsMenuOpen(false);
                          }}
                          className={`flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50`}
                        >
                          <Trash2 size={16} className="mr-3" />
                          Delete Playlist
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Song List */}
          <DroppablePlaylist
            playlistId={playlist.id}
            songs={playlistSongs}
            currentSongId={currentSong?.id || null}
            isPlaying={isPlaying}
            likedSongs={likedSongs}
            onSongPlay={handleSongPlay}
            onSongLike={toggleLike}
            formatDuration={formatDuration}
          />
        </div>

        {/* Modals */}
        <PlaylistModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          playlist={playlist}
        />
        <SharePlaylistModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          playlist={playlist}
        />
      </div>
    </DndProvider>
  );
}; 
