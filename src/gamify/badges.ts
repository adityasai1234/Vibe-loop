export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  xpRequired: number;
  condition: {
    type: 'mood_streak' | 'total_xp' | 'shares' | 'daily_cards' | 'sessions_hosted';
    value: number;
  };
  lottieUrl: string;
}

export const XP_TIERS = {
  Bronze: { min: 0, max: 99, color: '#CD7F32' },
  Silver: { min: 100, max: 299, color: '#C0C0C0' },
  Gold: { min: 300, max: 699, color: '#FFD700' },
  Platinum: { min: 700, max: 1499, color: '#E5E4E2' },
  Diamond: { min: 1500, max: Infinity, color: '#B9F2FF' }
};

export const BADGES: Badge[] = [
  {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: 'Log your mood for 7 consecutive days',
    icon: '🔥',
    tier: 'Bronze',
    xpRequired: 70,
    condition: { type: 'mood_streak', value: 7 },
    lottieUrl: '/lottie/streak_starter.json'
  },
  {
    id: 'mood_master',
    name: 'Mood Master',
    description: 'Log your mood for 30 consecutive days',
    icon: '🎯',
    tier: 'Gold',
    xpRequired: 300,
    condition: { type: 'mood_streak', value: 30 },
    lottieUrl: '/lottie/mood_master.json'
  },
  {
    id: 'curious_cat',
    name: 'Curious Cat',
    description: 'Open daily surprise cards for 7 consecutive days',
    icon: '🐱',
    tier: 'Silver',
    xpRequired: 140,
    condition: { type: 'daily_cards', value: 7 },
    lottieUrl: '/lottie/curious_cat.json'
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Host 5 co-listening sessions',
    icon: '🦋',
    tier: 'Gold',
    xpRequired: 500,
    condition: { type: 'sessions_hosted', value: 5 },
    lottieUrl: '/lottie/social_butterfly.json'
  },
  {
    id: 'share_champion',
    name: 'Share Champion',
    description: 'Share 10 music snippets',
    icon: '🏆',
    tier: 'Platinum',
    xpRequired: 800,
    condition: { type: 'shares', value: 10 },
    lottieUrl: '/lottie/share_champion.json'
  },
  {
    id: 'vibe_legend',
    name: 'Vibe Legend',
    description: 'Reach 1500 XP points',
    icon: '👑',
    tier: 'Diamond',
    xpRequired: 1500,
    condition: { type: 'total_xp', value: 1500 },
    lottieUrl: '/lottie/vibe_legend.json'
  }
];

export const XP_REWARDS = {
  MOOD_LOG: 10,
  DAILY_CARD_OPEN: 20,
  SHARE_SNIPPET: 20,
  HOST_SESSION: 50,
  JOIN_SESSION: 5,
  FIRST_SHARE_OF_DAY: 20
};

export function getUserLevel(xp: number): string {
  for (const [tier, range] of Object.entries(XP_TIERS)) {
    if (xp >= range.min && xp <= range.max) {
      return tier;
    }
  }
  return 'Bronze';
}

export function getNextLevelProgress(xp: number): { current: string; next: string; progress: number } {
  const currentLevel = getUserLevel(xp);
  const currentTier = XP_TIERS[currentLevel as keyof typeof XP_TIERS];
  
  const tierNames = Object.keys(XP_TIERS);
  const currentIndex = tierNames.indexOf(currentLevel);
  const nextLevel = tierNames[currentIndex + 1] || currentLevel;
  
  if (nextLevel === currentLevel) {
    return { current: currentLevel, next: currentLevel, progress: 100 };
  }
  
  const nextTier = XP_TIERS[nextLevel as keyof typeof XP_TIERS];
  const progress = ((xp - currentTier.min) / (nextTier.min - currentTier.min)) * 100;
  
  return { current: currentLevel, next: nextLevel, progress: Math.min(progress, 100) };
}