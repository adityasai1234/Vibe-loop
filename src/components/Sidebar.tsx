import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, User, Music, Plus, X, Upload, Edit2, Trash2, Share2 } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useWindowSize } from '../hooks/useWindowSize';
import { usePlaylistStore } from '../store/playlistStore';
import { Playlist } from '../types';
import { SharePlaylistModal } from './SharePlaylistModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isDark } = useThemeStore();
  const { isDesktop } = useWindowSize();
  const { playlists, updatePlaylist, createPlaylist, deletePlaylist } = usePlaylistStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedPlaylistForShare, setSelectedPlaylistForShare] = useState<Playlist | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/liked', icon: Heart, label: 'Liked Songs' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/queue', icon: Music, label: 'Queue' },
  ];

  const handleEdit = (playlistId: string, currentName: string) => {
    setEditingId(playlistId);
    setEditValue(currentName);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSubmit = (playlistId: string) => {
    if (editValue.trim()) {
      updatePlaylist(playlistId, { title: editValue.trim() });
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleAddPlaylist = () => {
    const newPlaylistTitle = 'New Playlist';
    createPlaylist({
      title: newPlaylistTitle,
      songs: [],
      coverArt: '',
      createdBy: '',
    });
    setTimeout(() => {
      const latest = playlists[playlists.length - 1];
      if (latest) {
        setEditingId(latest.id);
        setEditValue(newPlaylistTitle);
      }
    }, 100);
  };

  const handleSharePlaylist = (playlist: Playlist) => {
    setSelectedPlaylistForShare(playlist);
    setIsShareModalOpen(true);
  };

  const sidebarContent = (
    <div className={`h-full flex flex-col transition-colors duration-300 bg-white text-secondary-800 dark:bg-secondary-950 dark:text-secondary-100`}>
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={onClose}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              isActive(path)
                ? isDark ? 'bg-primary-700 text-white' : 'bg-primary-500 text-white'
                : isDark ? 'bg-primary-600 text-white' : 'bg-primary-500 text-white'
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Playlists */}
      <div className={`px-4 py-4 border-t border-dashed ${
        isDark ? 'border-secondary-800' : 'border-secondary-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xs font-semibold uppercase tracking-wider ${
            isDark ? 'text-secondary-400' : 'text-secondary-500'
          }`}>
            Playlists
          </h2>
          <button
            className={`p-1 rounded-full transition-colors duration-200 ${
              isDark
                ? 'hover:bg-secondary-800'
                : 'hover:bg-secondary-100'
            }`}
            onClick={handleAddPlaylist}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="flex items-center group">
              <Music className="mr-3 h-5 w-5" />
              {editingId === playlist.id ? (
                <input
                  className={`flex-1 bg-transparent border-b border-primary-500 focus:outline-none px-1 text-sm text-secondary-900 dark:text-white`}
                  value={editValue}
                  autoFocus
                  onChange={handleEditChange}
                  onBlur={() => handleEditSubmit(playlist.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSubmit(playlist.id);
                    if (e.key === 'Escape') { setEditingId(null); setEditValue(''); }
                  }}
                />
              ) : (
                <>
                  <Link
                    className="flex-1 text-left truncate px-1 py-2 hover:underline"
                    to={`/playlist/${playlist.id}`}
                    onClick={onClose}
                  >
                    {playlist.title}
                  </Link>
                  <button
                    className="ml-2 opacity-100 p-1 rounded hover:bg-secondary-700"
                    title="Rename playlist"
                    onClick={() => handleEdit(playlist.id, playlist.title)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="ml-1 opacity-100 p-1 rounded hover:bg-secondary-700"
                    title="Share playlist"
                    onClick={() => handleSharePlaylist(playlist)}
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    className="ml-1 opacity-100 p-1 rounded hover:bg-red-700 text-red-500"
                    title="Delete playlist"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this playlist?')) {
                        deletePlaylist(playlist.id);
                        if (editingId === playlist.id) {
                          setEditingId(null);
                          setEditValue('');
                        }
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <aside className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 fixed top-16 bottom-0 overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Backdrop for overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Overlay Sidebar */}
      <div
        className={`fixed inset-x-0 top-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="h-full pt-16 flex flex-col">
          <div className={`px-4 py-4 flex items-center justify-end ${
            isDark ? 'bg-secondary-950' : 'bg-white'
          }`}>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
              }`}
            >
              <X size={24} />
            </button>
          </div>
          {sidebarContent}
        </div>
      </div>
      {selectedPlaylistForShare && (
        <SharePlaylistModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          playlist={selectedPlaylistForShare}
        />
      )}
    </>
  );
};
