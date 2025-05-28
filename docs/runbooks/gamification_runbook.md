# Vibe-Loop Gamification System Runbook

**Last Updated**: {{YYYY-MM-DD}} (Replace with current date)

This runbook provides procedures for operating, monitoring, and troubleshooting the Vibe-Loop gamification system.

## 1. System Overview

- **Core Components**: Firestore (data storage), Firebase Cloud Functions (backend logic), React frontend (UI and interaction).
- **Key Data Collections**:
  - `user_gamification/{userId}`: User-specific gamification state.
  - `badge_definitions/{badgeId}`: Definitions of all available badges.
  - `seasonal_configurations/{seasonId}`: Configurations for time-limited events.
  - `user_mood_logs/{logId}`: Raw mood entries by users.
  - `user_song_plays/{logId}`: Raw song play entries by users.
- **Key Cloud Functions**:
  - `initializeUserGamification`: Sets up new users.
  - `processMoodLog`: Handles mood streaks, mood explorer badges.
  - `processSongPlay`: Handles genre collector badges.
  - `processSeasonalAchievements`: Scheduled daily for seasonal badges.
  - `logAnalyticsEvent`: Callable for frontend analytics logging.

## 2. Monitoring

### 2.1. Firebase Console

- **Cloud Functions Logs**: Monitor logs for `initializeUserGamification`, `processMoodLog`, `processSongPlay`, `processSeasonalAchievements`, and `logAnalyticsEvent` for errors or unexpected behavior.
  - **Location**: Firebase Console -> Functions -> Logs.
  - **Filter by**: Function name and severity (Error, Warning).
- **Cloud Functions Health**: Check invocation counts, error rates, and execution times.
  - **Location**: Firebase Console -> Functions -> Dashboard / Health.
- **Firestore Usage**: Monitor reads, writes, and deletes, especially for gamification-related collections.
  - **Location**: Firebase Console -> Firestore Database -> Usage.
  - **Key Collections to Watch**: `user_gamification`, `user_mood_logs`, `user_song_plays`.
- **Cloud Scheduler**: Ensure the `processSeasonalAchievements` job is running as scheduled.
  - **Location**: Google Cloud Console -> Cloud Scheduler.

### 2.2. Google Analytics / BigQuery (Future)

- Once fully integrated, monitor custom gamification events in GA4/BigQuery dashboards for engagement trends and feature adoption.

## 3. Common Operational Tasks

### 3.1. Adding a New Badge Definition

1.  **Define Badge**: Determine `id`, `name`, `description`, `type`, `rarity`, `criteria[]`, `iconUrl`, `xpReward`.
2.  **Add to Firestore**: Manually add a new document to the `badge_definitions` collection in the Firebase console or use a script.
    - **Path**: `badge_definitions/{new_badge_id}`
    - **Data**: Fill in all fields as per the `BadgeDefinition` interface.
3.  **Testing**: Verify the badge can be earned by triggering the relevant conditions (e.g., log a mood, play songs).

### 3.2. Creating a New Seasonal Event

1.  **Define Season**: Determine `seasonId`, `name`, `startDate` (timestamp), `endDate` (timestamp), `description`, `active: true`.
2.  **Define Related Badges**: Ensure the `BadgeDefinition`(s) for this season exist in `badge_definitions` and are of type `SEASONAL_ACHIEVEMENT`.
3.  **Add to Firestore**: Manually add a new document to the `seasonal_configurations` collection.
    - **Path**: `seasonal_configurations/{new_season_id}`
    - **Data**: Fill in fields, including `relatedBadges: ["badge_id_1", "badge_id_2"]`.
4.  **Activation**: The `processSeasonalAchievements` scheduled function will pick up active seasons.
5.  **Monitoring**: Check Cloud Function logs for `processSeasonalAchievements` after the season starts to ensure badges are awarded.

### 3.3. Deactivating/Ending a Seasonal Event

1.  **Update Firestore**: Set `active: false` on the relevant document in `seasonal_configurations/{season_id}`.
2.  The `processSeasonalAchievements` function will no longer process this season for new badge awards.
3.  Earned badges remain with users, potentially marked as `retired` if that logic is added to display.

### 3.4. Manually Awarding XP or a Badge to a User (Emergency/Support)

*Caution: Perform with care, as this bypasses normal game logic.* 
1.  **Identify User**: Get the `userId`.
2.  **Locate Data**: Open `user_gamification/{userId}` in Firestore.
3.  **Award XP**:
    - Increment the `xp` field.
    - Recalculate `level` using `calculateLevel(newXp)` and update.
4.  **Award Badge**:
    - Identify the `badgeId` from `badge_definitions`.
    - Add an `EarnedBadge` object to the appropriate array (`moodExplorerBadges`, `genreCollectorBadges`, `seasonalAchievements`).
    - Ensure `earnedAt` timestamp is set.
    - Consider adding XP from `badge.xpReward` if not already included.
5.  **Save Changes** in Firestore console.

## 4. Troubleshooting

### 4.1. Badges Not Awarded

1.  **Check Cloud Function Logs**: Look for errors in `processMoodLog`, `processSongPlay`, or `processSeasonalAchievements` related to the specific user or badge.
2.  **Verify User Activity Logs**: Check `user_mood_logs` or `user_song_plays` to ensure the triggering event was correctly logged for the user.
3.  **Check Badge Definition**: Ensure the `badge_definitions/{badgeId}` document is correct, criteria are as expected, and `type` matches the awarding function.
4.  **Check Seasonal Configuration**: For seasonal badges, ensure `seasonal_configurations/{seasonId}` is active, dates are correct, and `relatedBadges` includes the target badge.
5.  **Check User Gamification Data**: Inspect `user_gamification/{userId}`. Has the badge already been awarded? Is `xp`, `moodStreak` etc. as expected?
6.  **Firestore Rules**: Ensure rules are not blocking writes by Cloud Functions (should not be an issue if service accounts are used correctly).

### 4.2. Mood Streak Incorrect / Resetting Unexpectedly

1.  **Check `processMoodLog` Logs**: Look for how `moodStreak` and `lastMoodLogDate` are being calculated for the user.
2.  **Inspect `user_mood_logs`**: Verify timestamps of mood logs. Are there gaps that would legitimately break the streak?
3.  **Timezone Consideration**: The current logic primarily uses UTC date comparisons. If strict local timezone (e.g., Asia/Kolkata) adherence is critical and issues arise, the date comparison logic in `processMoodLog` may need adjustment with a timezone-aware library.
4.  **Inspect `user_gamification/{userId}`**: Check `lastMoodLogDate` and `moodStreak` values.

### 4.3. XP Multiplier Not Applying

1.  **Check `processMoodLog` Logs**: Verify calculation of `currentStreakMultiplier`.
2.  **Verify Mood Streak**: The multiplier depends on the `moodStreak`. Troubleshoot streak issues first.
3.  **Inspect `user_gamification/{userId}`**: Check `currentStreakMultiplier` and `lastStreakMultiplierUpdate`.

### 4.4. Seasonal Badges Not Awarded by Scheduled Function

1.  **Check `processSeasonalAchievements` Logs**: This is the primary source for issues.
2.  **Verify Cloud Scheduler**: Ensure the job is enabled and ran successfully at the expected time.
3.  **Check `seasonal_configurations`**: Is the season active (`active: true`), `startDate` passed, `endDate` not passed?
4.  **Check User Iteration**: If the function logs indicate it's running but not awarding to specific users, there might be an issue with the user iteration logic or criteria checking within the loop.

## 5. Escalation

- If issues persist and cannot be resolved through these steps, escalate to the backend development team or Firebase administrator.
- Provide relevant `userIds`, `badgeIds`, timestamps, and excerpts from Cloud Function logs.