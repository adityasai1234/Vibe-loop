// Export all types from gamification
export type {
  UserGamificationData,
  MoodLog,
  BadgeType,
  BadgeRarity,
  BadgeCriteria,
  BadgeDefinition,
  EarnedBadge,
  SongPlayLog,
  SeasonalConfiguration
} from './gamification';

// Core types
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

import { UserGamificationData, MoodLog as GamificationMoodLog } from './gamification';

export interface User {
  id: string;
  name: string;
  username: string;
  profilePic: string;
  followers: number;
  following: number;
  favoriteSongs: string[];
  recentlyPlayed: string[];
  currentMood?: string;
  moodHistory?: MoodEntry[]; // This might be deprecated in favor of MoodLog
  gamification?: UserGamificationData;
}

// It seems MoodEntry is similar to MoodLog. We should consolidate if possible.
// For now, keeping both and aliasing MoodLog from gamification.ts to avoid naming conflict.
// Consider replacing MoodEntry with GamificationMoodLog if they serve the same purpose.
export { GamificationMoodLog };


export interface MoodEntry {
  mood: string;
  timestamp: number;
}

export interface Playlist {
  id: string;
  title: string;
  coverArt: string;
  songs: string[];
  createdBy: string;
  likes: number;
};

export type ThemeState = {
  isDark: boolean;
  toggleTheme: () => void;
  syncThemeWithFirebase: (userId: string) => Promise<void>;
  loadThemeFromFirebase: (userId: string) => Promise<void>;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
};
