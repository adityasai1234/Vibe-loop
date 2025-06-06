import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MoodEntry } from '../types';

interface MoodState {
  entries: MoodEntry[];
  selectedMood: string | null;
  addEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<MoodEntry>) => void;
  deleteEntry: (id: string) => void;
  setSelectedMood: (mood: string | null) => void;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      entries: [],
      selectedMood: null,
      addEntry: (entry) => set((state) => ({
        entries: [...state.entries, { ...entry, id: crypto.randomUUID() }]
      })),
      updateEntry: (id, entry) => set((state) => ({
        entries: state.entries.map((e) => 
          e.id === id ? { ...e, ...entry } : e
        )
      })),
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((e) => e.id !== id)
      })),
      setSelectedMood: (mood) => set({ selectedMood: mood })
    }),
    {
      name: 'mood-storage'
    }
  )
);