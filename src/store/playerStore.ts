import React from 'react';
import { create } from 'zustand';
import { songs } from '../data/songs';
import { Song } from '../types';
import { AudioEngine } from "@/audio/AudioEngine";
import { EqPreset } from "@/audio/eqPresets";

const engine = new AudioEngine();

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  queue: Song[];
  playbackProgress: number;
  playbackRate: number;
  audioRef?: React.RefObject<HTMLAudioElement>;
  crossfadeSec: number;
  eqPreset: EqPreset;
  
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
  setPlaybackRate: (rate: number) => void;
  setCrossfade: (sec: number) => void;
  setEqPreset: (preset: EqPreset) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  queue: [],
  playbackProgress: 0,
  playbackRate: 1,
  crossfadeSec: 2,
  eqPreset: "Flat",
  
  setCurrentSong: (song) => {
    set({ currentSong: song, isPlaying: true, playbackProgress: 0 });
    engine.play(song.url);
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
  
  setPlaybackRate: (rate) => {
    set({ playbackRate: rate });
    // sync immediately to <audio> element if mounted
    const audioRef = get().audioRef?.current;
    if (audioRef) {
      audioRef.playbackRate = rate;
    }
  },
  
  setCrossfade: (sec) => {
    engine.crossfadeSec = sec;
    set({ crossfadeSec: sec });
  },
  
  setEqPreset: (preset) => {
    engine.applyEqPreset(preset);
    set({ eqPreset: preset });
  },
}));
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffleArray(songs);