import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'Olivia Martinez',
    username: 'olivia_m',
    profilePic: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    followers: 1542,
    following: 342,
    favoriteSongs: ['1', '4', '6'],
    recentlyPlayed: ['4', '2', '7', '3']
  },
  {
    id: '2',
    name: 'Ethan Campbell',
    username: 'ethan_beats',
    profilePic: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    followers: 872,
    following: 215,
    favoriteSongs: ['2', '7', '5'],
    recentlyPlayed: ['5', '1', '8']
  }
];