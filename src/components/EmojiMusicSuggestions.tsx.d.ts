import { SongMetadata } from '../services/firestoreService';

export interface EmojiMusicSuggestionsProps {
  onSongSelect?: (song: SongMetadata) => void;
}

export interface EmojiCategory {
  name: string;
  emoji: string;
  description: string;
  genres: string[];
}

export const EmojiMusicSuggestions: React.FC<EmojiMusicSuggestionsProps>;
