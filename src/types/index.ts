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
}

export interface Playlist {
  id: string;
  title: string;
  coverArt: string;
  songs: string[];
  createdBy: string;
  likes: number;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  songs: string[];
  note?: string;
}

export interface Mood {
  emoji: string;
  label: string;
  description: string;
  songIds: string[];
}