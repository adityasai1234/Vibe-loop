export interface Song {
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
}

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
  moodHistory?: MoodEntry[];
}

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
}

export interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  syncThemeWithFirebase: (userId: string) => Promise<void>;
  loadThemeFromFirebase: (userId: string) => Promise<void>;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
};
