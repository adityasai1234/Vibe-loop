import { User, Song, Playlist } from './index';

export type TimeBasedGreetingProps = {
  user: User;
};

export type MoodStreakProps = {
  user: User;
  mood?: string;
};

export type MoodSelectorProps = {
  onSelectMood: (mood: string) => void;
  onClose: () => void;
};

export type DailyDiscoveryMixProps = {
  songs: Song[];
  mood?: string;
};

export type MoodSongListProps = {
  songs: Song[];
  mood?: string;
};

export type PlaylistCardProps = {
  playlist: Playlist;
  user: User;
  mood?: string;
};

export type MoodShuffleProps = {
  songs: Song[];
  mood?: string;
  onMoodSelect: (mood: string) => void;
};
