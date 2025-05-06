import { Nfc } from 'lucide-react';
import { Playlist } from '../types';

export const playlists: Playlist[] = [
  {
    id: '1',
    title: 'Chill Vibes',
    coverArt: 'https://images.pexels.com/photos/3394299/pexels-photo-3394299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    songs: ['1', '3', '5', '8'],
    createdBy: '1',
    likes: 876
  },
  {
    id: '2',
    title: 'Urban Beats',
    coverArt: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    songs: ['2', '4', '7'],
    createdBy: '2',
    likes: 653
  },
  {
    id: '3',
    title: 'Late Night Drive',
    coverArt: 'https://images.pexels.com/photos/3651820/pexels-photo-3651820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    songs: ['2', '6', '7', '4'],
    createdBy: '1',
    likes: 1240
  }
];
export const playlistsWithSongs = playlists.map(playlist => ({
  ...playlist,
  songs: playlist.songs.map(songId => ({
    id: songId,
    title: `Song ${songId}`,
    artist: `Artist ${songId}`,
    albumArt: `https://picsum.photos/200/200?random=${songId}`,
    genre: 'Pop',
    releaseDate: '2023-01-01'
  }))
}));
export const playlistsWithSongsAndLikes = playlistsWithSongs.map(playlist => ({
  ...playlist,
  likes: Math.floor(Math.random() * 1000) + 1,
  songs: playlist.songs.map(song => ({ ...song, likes: Math.floor(Math.random() * 1000) + 1 }))
}));
export const playlistsWithSongsAndLikesAndCreatedBy = playlistsWithSongsAndLikes.map(playlist => ({
  ...playlist,
  createdBy: {
    id: playlist.createdBy,
    name: `User ${playlist.createdBy}`,
    profilePicture: `https://picsum.photos/200/200?random=${playlist.createdBy}`
  }
}));
