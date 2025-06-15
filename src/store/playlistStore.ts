import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Playlist } from '../types';

interface PlaylistState {
  playlists: Playlist[];
  sharedPlaylists: { [key: string]: string[] }; // playlistId -> userIds who have access
  
  // Actions
  createPlaylist: (playlist: Omit<Playlist, 'id' | 'likes'>) => void;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  reorderSongs: (playlistId: string, songId: string, newIndex: number) => void;
  moveSongBetweenPlaylists: (songId: string, sourcePlaylistId: string, targetPlaylistId: string) => void;
  sharePlaylist: (playlistId: string, userId: string) => void;
  unsharePlaylist: (playlistId: string, userId: string) => void;
  generateShareLink: (playlistId: string) => string;
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],
      sharedPlaylists: {},

      createPlaylist: (playlist) => {
        const newPlaylist: Playlist = {
          ...playlist,
          id: crypto.randomUUID(),
          likes: 0,
        };
        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));
      },

      updatePlaylist: (id, updates) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === id ? { ...playlist, ...updates } : playlist
          ),
        }));
      },

      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== id),
          sharedPlaylists: Object.fromEntries(
            Object.entries(state.sharedPlaylists).filter(([playlistId]) => playlistId !== id)
          ),
        }));
      },

      reorderSongs: (playlistId, songId, newIndex) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) => {
            if (playlist.id !== playlistId) return playlist;
            
            const songs = [...playlist.songs];
            const oldIndex = songs.indexOf(songId);
            if (oldIndex === -1) return playlist;
            
            songs.splice(oldIndex, 1);
            songs.splice(newIndex, 0, songId);
            
            return { ...playlist, songs };
          }),
        }));
      },

      moveSongBetweenPlaylists: (songId, sourcePlaylistId, targetPlaylistId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) => {
            if (playlist.id === sourcePlaylistId) {
              return {
                ...playlist,
                songs: playlist.songs.filter((id) => id !== songId),
              };
            }
            if (playlist.id === targetPlaylistId) {
              return {
                ...playlist,
                songs: [...playlist.songs, songId],
              };
            }
            return playlist;
          }),
        }));
      },

      sharePlaylist: (playlistId, userId) => {
        set((state) => ({
          sharedPlaylists: {
            ...state.sharedPlaylists,
            [playlistId]: [...(state.sharedPlaylists[playlistId] || []), userId],
          },
        }));
      },

      unsharePlaylist: (playlistId, userId) => {
        set((state) => ({
          sharedPlaylists: {
            ...state.sharedPlaylists,
            [playlistId]: (state.sharedPlaylists[playlistId] || []).filter((id) => id !== userId),
          },
        }));
      },

      generateShareLink: (playlistId) => {
        // In a real app, this would generate a secure, unique link
        // For now, we'll just use a simple URL with the playlist ID
        return `${window.location.origin}/playlist/${playlistId}`;
      },
    }),
    {
      name: 'playlist-storage',
    }
  )
); 
