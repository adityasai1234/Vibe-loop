import { create } from 'zustand';
import { songs } from '../data/songs';
import { Song } from '../types';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  playbackProgress: number;
  
  // Actions
  setCurrentSong: (song: Song) => void;
  togglePlayPause: () => void;
  play: () => void;
  pause: () => void;
  nextSong: () => void;
  prevSong: () => void;
  setVolume: (volume: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  setPlaybackProgress: (progress: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  queue: [],
  playbackProgress: 0,
  
  setCurrentSong: (song) => {
    set({ currentSong: song, isPlaying: true, playbackProgress: 0 });
  },
  
  togglePlayPause: () => {
    const { isPlaying, currentSong } = get();
    
    if (!currentSong && songs.length > 0) {
      set({ currentSong: songs[0], isPlaying: true });
      return;
    }
    
    set({ isPlaying: !isPlaying });
  },
  
  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  nextSong: () => {
    const { currentSong, queue } = get();
    
    if (queue.length > 0) {
      const nextSong = queue[0];
      const newQueue = queue.slice(1);
      set({ currentSong: nextSong, queue: newQueue, playbackProgress: 0 });
      return;
    }
    
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    set({ currentSong: songs[nextIndex], playbackProgress: 0 });
  },
  
  prevSong: () => {
    const { currentSong } = get();
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    set({ currentSong: songs[prevIndex], playbackProgress: 0 });
  },
  
  setVolume: (volume) => set({ volume }),
  
  addToQueue: (song) => {
    const { queue } = get();
    set({ queue: [...queue, song] });
  },
  
  removeFromQueue: (songId) => {
    const { queue } = get();
    set({ queue: queue.filter(song => song.id !== songId) });
  },
  
  setPlaybackProgress: (progress) => set({ playbackProgress: progress }),
}));