# Vibe-Loop Gamification System

This document outlines the architecture and implementation details of the gamification features within the Vibe-Loop application.

## 1. Goals

The primary goals of the gamification system are to:
- Increase Daily Active Users (DAU) by 30%.
- Increase average session length by 20%.
These goals are targeted to be achieved within 60 days of launch.

## 2. Implemented Features

The following gamification systems have been implemented:

### 2.1. Mood Explorer Badges
- **Concept**: Users earn badges for exploring and logging a variety of unique moods.
- **Tiers**: Badges are awarded when a user logs 5, 10, 20, and 40 unique mood categories.
- **Logic**: Handled by the `processMoodLog` Cloud Function, triggered on new entries in `user_mood_logs`.

### 2.2. Genre Collector Badges
- **Concept**: Users earn badges for listening to multiple genres within a single mood session.
- **Definition of Session**: Streaming tracks of different genres while the selected mood remains the same within a 24-hour period.
- **Tiers**: Badges are awarded for streaming >= 3, 5, or 10 different genres in one such session.
- **Logic**: Handled by the `processSongPlay` Cloud Function, triggered on new entries in `user_song_plays`.

### 2.3. Seasonal Achievements
- **Concept**: Time-limited badges tied to specific events or seasons (e.g., "Spooky Vibes 🎃" for Halloween).
- **Lifecycle**: These badges have defined start and end dates. Once expired, they are marked as `retired: true` but remain in the user's earned history.
- **Logic**: Managed by the `processSeasonalAchievements` scheduled Cloud Function, which checks active seasons and awards badges to eligible users.

### 2.4. Mood Streak Multipliers
- **Concept**: Users are rewarded with an XP multiplier for logging their mood on consecutive days.
- **Multiplier Tiers**:
  - 1-2 days: 1.0x XP
  - 3-6 days: 1.2x XP
  - 7-13 days: 1.5x XP
  - 14+ days: 2.0x XP
- **Reset Condition**: The streak resets if no mood is logged during a local calendar day (Asia/Kolkata timezone is considered for calculation logic in Cloud Functions if applicable, though current implementation uses UTC date comparisons for simplicity and global consistency unless explicitly configured for IST in date logic).
- **Logic**: Calculated within the `processMoodLog` Cloud Function.

## 3. Data Model (Firestore)

Key Firestore collections supporting gamification:

- **`user_gamification/{userId}`**: Stores individual user's gamification state.
  - `userId: string`
  - `xp: number`
  - `level: number`
  - `moodStreak: number`
  - `lastMoodLogDate: timestamp` (for streak calculation)
  - `longestMoodStreak: number`
  - `seasonalAchievements: EarnedBadge[]`
  - `moodExplorerBadges: EarnedBadge[]`
  - `genreCollectorBadges: EarnedBadge[]`
  - `currentStreakMultiplier: number`
  - `lastStreakMultiplierUpdate: timestamp`

- **`badge_definitions/{badgeId}`**: Central repository for all badge definitions.
  - `id: string`
  - `name: string`
  - `description: string`
  - `type: BadgeType` (MOOD_EXPLORER, GENRE_COLLECTOR, SEASONAL_ACHIEVEMENT)
  - `rarity: BadgeRarity` (COMMON, RARE, EPIC, LEGENDARY)
  - `criteria: BadgeCriteria[]`
  - `iconUrl: string`
  - `xpReward: number`

- **`seasonal_configurations/{seasonId}`**: Defines parameters for seasonal events.
  - `seasonId: string`
  - `name: string`
  - `startDate: timestamp`
  - `endDate: timestamp`
  - `description: string` (optional)
  - `active: boolean`
  - `relatedBadges: string[]` (IDs of `BadgeDefinition` for this season)

- **`user_mood_logs/{logId}`**: Logs each time a user records their mood.
  - `userId: string`
  - `mood: string`
  - `timestamp: timestamp`
  - `source: string` (e.g., 'mood_selector', 'journal_entry')

- **`user_song_plays/{logId}`**: Logs song playback events relevant for genre collection.
  - `userId: string`
  - `songId: string`
  - `genre: string`
  - `mood: string` (optional, if associated with the play)
  - `timestamp: timestamp`

Refer to `/src/types/gamification.ts` for detailed TypeScript interfaces.

## 4. Cloud Functions (Backend Logic)

Located in `/functions/src/`:

- **`gamificationTriggers.ts`**
  - `initializeUserGamification`: Triggered on new user creation (via `/users/{userId}` document creation) to set up their initial gamification profile in `user_gamification`.
- **`moodProcessingTrigger.ts`**
  - `processMoodLog`: Triggered by new documents in `user_mood_logs`. Updates XP, mood streaks, streak multipliers, and checks for Mood Explorer badges.
- **`songPlayProcessingTrigger.ts`**
  - `processSongPlay`: Triggered by new documents in `user_song_plays`. Updates XP (if any) and checks for Genre Collector badges.
- **`seasonalAchievementTrigger.ts`**
  - `processSeasonalAchievements`: A scheduled function (e.g., daily) that checks active `seasonal_configurations` and awards badges to users who meet criteria (e.g., activity during the season).
- **`logAnalytics.ts`**
  - `logAnalyticsEvent`: A callable function for the frontend to send analytics events. This function can then proxy these events to GA4, BigQuery, or other analytics platforms.

## 5. Frontend Integration

Located in `/src/`:

- **Context & Hooks**:
  - `context/GamificationContext.tsx`: Provides `GamificationProvider` and `useGamification` hook to access user's gamification data, log moods/song plays, and interact with badges.
- **UI Components**:
  - `components/gamification/BadgeGrid.tsx`: Displays earned badges for a specific category.
  - `components/gamification/XPBar.tsx`: Shows current XP, level, and progress to the next level.
  - `components/gamification/StreakChip.tsx`: Displays current mood streak and XP multiplier.
- **Animations & Notifications**:
  - `components/ui/ConfettiAnimation.tsx`: A reusable component for confetti effects (e.g., on badge unlock).
  - `components/ui/ToastQueue.tsx`: Provides `ToastProvider` and `useToasts` hook for displaying in-app notifications.

## 6. Firestore Security Rules

Conceptual rules are outlined in `/firestore.rules.md`. Key principles:
- Users can read their own gamification data (`user_gamification/{userId}`).
- Users can read public data like `badge_definitions` and active `seasonal_configurations`.
- Writes to `user_gamification` are primarily handled by Cloud Functions to ensure integrity and apply game logic.
- Users can create `user_mood_logs` and `user_song_plays` for their own ID, which then trigger backend processing.

## 7. Future Considerations & ADRs (To be detailed)

- **Scalability of User Iteration**: The `processSeasonalAchievements` function iterates all users. For very large user bases, this might need optimization (e.g., batching, targeting recently active users, or an event-driven approach for specific seasonal actions).
- **Timezone Handling for Streaks**: Currently, streak logic uses UTC-based date comparisons. For strict Asia/Kolkata day checking, Cloud Functions would need to incorporate timezone conversions using a library like `moment-timezone` or `date-fns-tz` when comparing `lastMoodLogDate` and the current timestamp.
- **Admin Panel**: A dedicated admin interface for managing `badge_definitions` and `seasonal_configurations` would be beneficial.
- **Detailed ADRs**: Separate ADR documents should be created for significant decisions (e.g., choice of Firestore for logs vs. a dedicated analytics DB, specific library choices for animations/notifications).

This document will be updated as the gamification system evolves.