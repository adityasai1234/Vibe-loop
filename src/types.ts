// src/types.ts

export interface Song {
  id: string | number;
  title: string;
  artist: string;
  genre: string;
  albumArt: string;
  duration: number;
  audioSrc?: string;
  audioUrl?: string; // Added for compatibility with our implementation
  releaseDate?: string;
  likes?: number;
  mood?: string[];
  activity?: string[];
  timeOfDay?: string[];
  tags?: string[];
}