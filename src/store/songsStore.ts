import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Playlist } from '../types';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  url: string;
  duration: number;
  genre: string;
  releaseDate: string;
  mood: string[];
}

interface SongsState {
  songs: Song[];
  playlists: Playlist[];
  recentlyPlayed: string[];
  likedSongs: string[];
  addToPlaylist: (playlistId: string, songId: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  toggleLike: (songId: string) => void;
  addToRecentlyPlayed: (songId: string) => void;
}

const sampleSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b',
    url: '',
    duration: 354,
    genre: 'Rock',
    releaseDate: '1975-10-31',
    mood: [],
  },
  {
    id: '2',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    album: 'Thriller',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f5',
    url: 'https://example.com/billie-jean.mp3',
    duration: 294,
    genre: 'Pop',
    releaseDate: '1983-01-02',
    mood: [],
  },
  {
    id: '3',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    album: 'Nevermind',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e2e352d5e5d0e0b1e3fd4d1a',
    url: 'https://example.com/smells-like-teen-spirit.mp3',
    duration: 301,
    genre: 'Rock',
    releaseDate: '1991-09-10',
    mood: [],
  },
  {
    id: '4',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    url: '',
    duration: 235,
    genre: 'Pop',
    releaseDate: '2017-01-06',
    mood: [],
  },
  {
    id: '5',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
    url: 'https://example.com/blinding-lights.mp3',
    duration: 200,
    genre: 'Pop',
    releaseDate: '2019-11-29',
    mood: [],
  },
];

const samplePlaylists: Playlist[] = [
  {
    id: '1',
    title: 'Rock Classics',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b',
    songs: ['1', '3'],
    createdBy: '1',
    likes: 0
  },
  {
    id: '2',
    title: 'Pop Hits',
    coverArt: 'https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f5',
    songs: ['2', '4', '5'],
    createdBy: '1',
    likes: 0
  },
];

export const useSongsStore = create<SongsState>()(
  persist(
    (set) => ({
      songs: sampleSongs,
      playlists: samplePlaylists,
      recentlyPlayed: [],
      likedSongs: [],
      addToPlaylist: (playlistId, songId) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? { ...playlist, songs: [...playlist.songs, songId] }
              : playlist
          ),
        })),
      removeFromPlaylist: (playlistId, songId) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? { ...playlist, songs: playlist.songs.filter((id) => id !== songId) }
              : playlist
          ),
        })),
      toggleLike: (songId) =>
        set((state) => ({
          likedSongs: state.likedSongs.includes(songId)
            ? state.likedSongs.filter((id) => id !== songId)
            : [...state.likedSongs, songId],
        })),
      addToRecentlyPlayed: (songId) =>
        set((state) => ({
          recentlyPlayed: [songId, ...state.recentlyPlayed.filter((id) => id !== songId)].slice(0, 20),
        })),
    }),
    {
      name: 'songs-storage',
    }
  )
);
