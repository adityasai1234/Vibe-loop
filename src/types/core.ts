import { UserGamificationData, MoodLog } from './gamification';

export type { UserGamificationData, MoodLog };

export type Song = {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: number;
  audioSrc: string;
  genre: string;
  releaseDate: string;
  likes: number;
  tags?: string[];
  mood?: string[];
  activity?: string[];
  timeOfDay?: string[];
  intensity?: number;
};

export type User = {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  followers: number;
  following: number;
  favoriteSongs: string[];
  recentlyPlayed: string[];
  currentMood?: string;
  moodHistory?: MoodLog[];
  gamification?: UserGamificationData;
};

export type Playlist = {
  id: string;
  title: string;
  coverArt: string;
  songs: string[];
  createdBy: string;
  likes: number;
};

export type MoodEntry = {
  mood: string;
  timestamp: number;
};
