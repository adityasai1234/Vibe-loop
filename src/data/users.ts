import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    profilePic: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    followers: 1234,
    following: 567,
    favoriteSongs: ['1', '3', '5', '7'],
    recentlyPlayed: ['2', '4', '6', '8']
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: 'janesmith',
    profilePic: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    followers: 2345,
    following: 789,
    favoriteSongs: ['2', '4', '6', '8'],
    recentlyPlayed: ['1', '3', '5', '7']
  }
];
