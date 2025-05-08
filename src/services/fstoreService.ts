// ... existing code ...
export interface JournalEntryData {
  userId: string;
  mood: string;
  note?: string;
  timestamp: number;
  songs?: (SongMetadata & { id: string })[];
  // Add missing emotionLevel field
  emotionLevel?: number;
}