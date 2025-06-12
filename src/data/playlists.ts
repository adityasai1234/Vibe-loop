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
