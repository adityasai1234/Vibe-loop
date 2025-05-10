// src/types.ts

export interface Song {
  id: string | number;
  title: string;
  artist: string;
  genre: string;
  albumArt: string;
  duration: number;
  audioSrc: string;
  releaseDate?: string;
  likes?: number;
  mood?: string[];
  activity?: string[];
  timeOfDay?: string[];
  tags?: string[];
}