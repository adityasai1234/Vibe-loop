export enum BadgeType {
  MOOD_EXPLORER = 'mood_explorer',
  GENRE_COLLECTOR = 'genre_collector',
  SEASONAL_ACHIEVEMENT = 'seasonal_achievement',
}

export enum BadgeRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export type BadgeCriteria = {
  type: 'distinct_moods' | 'mood_streak' | 'distinct_genres' | 'songs_in_genre' | 'seasonal_event';
  value: number | string; // e.g., 5 (distinct moods), 7 (mood streak), 'christmas_2024'
  genre?: string; // For GENRE_COLLECTOR type
  season?: string; // For SEASONAL_ACHIEVEMENT type
};

export type BadgeDefinition = {
  id: string; // e.g., 'mood_explorer_level_1', 'genre_collector_pop_fanatic'
  name: string;
  description: string;
  type: BadgeType;
  rarity: BadgeRarity;
  criteria: BadgeCriteria[];
  iconUrl: string; // URL to badge icon
  xpReward: number;
};

export type EarnedBadge = {
  badgeId: string;
  earnedAt: number; // Timestamp
  seen?: boolean; // To track if the user has viewed the badge notification
};

export type UserGamificationData = {
  userId: string;
  xp: number;
  level: number; // Calculated from XP
  moodStreak: number;
  lastMoodLogDate?: number; // Timestamp of the last mood log (for streak calculation)
  longestMoodStreak: number;
  seasonalAchievements: EarnedBadge[];
  moodExplorerBadges: EarnedBadge[];
  genreCollectorBadges: EarnedBadge[];
  lastStreakMultiplierUpdate?: number; // Timestamp
  currentStreakMultiplier: number;
};

export type MoodLog = {
  userId: string;
  mood: string;
  timestamp: number;
  source?: string; // e.g., 'mood_selector', 'journal_entry'
};

export type SongPlayLog = {
  userId: string;
  songId: string;
  genre: string;
  mood?: string; // If available from song metadata
  timestamp: number;
  durationPlayed?: number; // Optional: seconds played
};

export type SeasonalConfiguration = {
  seasonId: string; // e.g., 'summer_2024', 'winter_holidays_2024'
  name: string;
  startDate: number; // Timestamp
  endDate: number; // Timestamp
  description?: string;
  active: boolean;
  relatedBadges: string[]; // IDs of BadgeDefinition for this season
};

// Helper functions (can be in a separate utility file if preferred)

/**
 * Calculates user level based on XP.
 * Example: 100 XP per level.
 */
export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

/**
 * Calculates streak multiplier based on mood streak length.
 * Example: 1x for 0-2 days, 1.1x for 3-6 days, 1.2x for 7-13 days, etc.
 */
export const calculateStreakMultiplier = (streak: number): number => {
  if (streak >= 28) return 1.5; // Max multiplier for 4 weeks+
  if (streak >= 14) return 1.3; // 2 weeks
  if (streak >= 7) return 1.2;  // 1 week
  if (streak >= 3) return 1.1;  // 3 days
  return 1.0; // Base multiplier
};