import React, { useState, useEffect } from 'react';
import { usePlaylistStore } from '../store/playlistStore';
import { useThemeStore } from '../store/themeStore';
import { X, Image as ImageIcon } from 'lucide-react';
import { Playlist } from '../types';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist?: Playlist; // If provided, we're editing an existing playlist
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose, playlist }) => {
  const { createPlaylist, updatePlaylist } = usePlaylistStore();
  const { isDark } = useThemeStore();
  
  const [title, setTitle] = useState('');
  const [coverArt, setCoverArt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title);
      setCoverArt(playlist.coverArt);
    } else {
      setTitle('');
      setCoverArt('');
    }
    setError(null);
  }, [playlist, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!title.trim()) {
        throw new Error('Playlist title is required');
      }

      if (playlist) {
        // Update existing playlist
        updatePlaylist(playlist.id, {
          title: title.trim(),
          coverArt: coverArt.trim() || playlist.coverArt,
        });
      } else {
        // Create new playlist
        createPlaylist({
          title: title.trim(),
          coverArt: coverArt.trim() || 'https://images.pexels.com/photos/3394299/pexels-photo-3394299.jpeg',
          songs: [],
          createdBy: '1', // This should come from the auth context in a real app
        });
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {playlist ? 'Edit Playlist' : 'Create Playlist'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 focus:border-primary-500'
                  : 'bg-white border-gray-300 focus:border-primary-500'
              } focus:outline-none focus:ring-1 focus:ring-primary-500`}
              placeholder="Enter playlist title"
            />
          </div>

          <div>
            <label htmlFor="coverArt" className="block text-sm font-medium mb-1">
              Cover Art URL
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="coverArt"
                value={coverArt}
                onChange={(e) => setCoverArt(e.target.value)}
                className={`flex-1 px-3 py-2 rounded-md border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 focus:border-primary-500'
                    : 'bg-white border-gray-300 focus:border-primary-500'
                } focus:outline-none focus:ring-1 focus:ring-primary-500`}
                placeholder="Enter cover art URL"
              />
              <button
                type="button"
                className={`p-2 rounded-md ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  // In a real app, this would open a file picker or image upload
                  setCoverArt('https://images.pexels.com/photos/3394299/pexels-photo-3394299.jpeg');
                }}
              >
                <ImageIcon size={20} />
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Saving...' : playlist ? 'Save Changes' : 'Create Playlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 