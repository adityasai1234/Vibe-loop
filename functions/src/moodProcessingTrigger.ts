import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { 
    UserGamificationData, 
    BadgeDefinition, 
    MoodLog, 
    EarnedBadge, 
    BadgeType, 
    calculateLevel, 
    calculateStreakMultiplier 
} from './types/gamification'; // Adjust path as needed if types are in a different location

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

const XP_FOR_MOOD_LOG = 10; // Define XP reward for logging a mood

/**
 * Processes new mood logs to update mood streaks, award Mood Explorer badges,
 * and update streak multipliers.
 * Triggered when a new document is created in `/user_mood_logs/{logId}`.
 */
export const processMoodLog = functions.firestore
  .document('user_mood_logs/{logId}')
  .onCreate(async (snap, context) => {
    const moodLog = snap.data() as MoodLog;
    const userId = moodLog.userId;
    const logTimestamp = moodLog.timestamp;

    if (!userId) {
        functions.logger.error('MoodLog missing userId', { moodLogId: snap.id });
        return null;
    }

    const gamificationRef = db.collection('user_gamification').doc(userId);

    try {
      return await db.runTransaction(async (transaction) => {
        const gamificationDoc = await transaction.get(gamificationRef);
        let userData: UserGamificationData;

        if (!gamificationDoc.exists) {
          functions.logger.warn(`UserGamificationData not found for user ${userId}, creating new.`);
          // Initialize if not present (should ideally be handled by initializeUserGamification)
          userData = {
            userId: userId,
            xp: 0,
            level: 1,
            moodStreak: 0,
            longestMoodStreak: 0,
            seasonalAchievements: [],
            moodExplorerBadges: [],
            genreCollectorBadges: [],
            currentStreakMultiplier: 1.0,
          };
        } else {
          userData = gamificationDoc.data() as UserGamificationData;
        }

        // 1. Update XP
        userData.xp += XP_FOR_MOOD_LOG;
        userData.level = calculateLevel(userData.xp);

        // 2. Update Mood Streak
        let newStreak = userData.moodStreak;
        if (userData.lastMoodLogDate) {
          const lastLogDate = new Date(userData.lastMoodLogDate);
          const currentLogDate = new Date(logTimestamp);
          
          // Normalize to date only (YYYY-MM-DD)
          const lastDateStr = `${lastLogDate.getUTCFullYear()}-${lastLogDate.getUTCMonth()}-${lastLogDate.getUTCDate()}`;
          const currentDateStr = `${currentLogDate.getUTCFullYear()}-${currentLogDate.getUTCMonth()}-${currentLogDate.getUTCDate()}`;

          const oneDayMs = 24 * 60 * 60 * 1000;
          const diffDays = Math.round((currentLogDate.getTime() - lastLogDate.getTime()) / oneDayMs);

          if (currentDateStr === lastDateStr) {
            // Same day log, no change to streak but update lastMoodLogDate to latest
          } else if (diffDays === 1) {
            newStreak++; // Consecutive day
          } else {
            newStreak = 1; // Streak broken, reset to 1
          }
        } else {
          newStreak = 1; // First mood log
        }
        userData.moodStreak = newStreak;
        userData.lastMoodLogDate = logTimestamp;
        if (newStreak > userData.longestMoodStreak) {
          userData.longestMoodStreak = newStreak;
        }

        // 3. Update Streak Multiplier
        userData.currentStreakMultiplier = calculateStreakMultiplier(userData.moodStreak);
        userData.lastStreakMultiplierUpdate = admin.firestore.Timestamp.now().toMillis();

        // 4. Check for Mood Explorer Badges
        const newMoodExplorerBadges = await checkMoodExplorerBadges(userId, userData, moodLog.mood, transaction);
        newMoodExplorerBadges.forEach(badge => {
          if (!userData.moodExplorerBadges.find(b => b.badgeId === badge.badgeId)) {
            userData.moodExplorerBadges.push(badge);
            userData.xp += badge.xpReward; // Add XP for new badge
          }
        });
        userData.level = calculateLevel(userData.xp); // Recalculate level after badge XP

        transaction.set(gamificationRef, userData); 
        functions.logger.info(`Processed mood log for user ${userId}`, { streak: newStreak, newXP: userData.xp });
        return null;
      });
    } catch (error) {
      functions.logger.error(`Error processing mood log for user ${userId}:`, error);
      throw new functions.https.HttpsError('internal', 'Failed to process mood log.');
    }
  });

/**
 * Checks and awards Mood Explorer badges based on distinct moods logged and mood streaks.
 */
async function checkMoodExplorerBadges(
  userId: string, 
  userData: UserGamificationData, 
  currentMood: string,
  transaction: admin.firestore.Transaction
): Promise<(EarnedBadge & { xpReward: number })[]> {
  const earnedBadges: (EarnedBadge & { xpReward: number })[] = [];
  const badgeDefinitionsSnapshot = await db.collection('badge_definitions')
                                         .where('type', '==', BadgeType.MOOD_EXPLORER)
                                         .get();

  if (badgeDefinitionsSnapshot.empty) return [];

  // Fetch all mood logs for the user to count distinct moods
  const moodLogsSnapshot = await db.collection('user_mood_logs')
                                   .where('userId', '==', userId)
                                   .get(); // In a high-traffic app, consider a summary doc or aggregation
  
  const distinctMoods = new Set<string>();
  moodLogsSnapshot.forEach(doc => distinctMoods.add(doc.data().mood));

  for (const doc of badgeDefinitionsSnapshot.docs) {
    const badge = doc.data() as BadgeDefinition;
    if (userData.moodExplorerBadges.find(b => b.badgeId === badge.id)) continue; // Already earned

    let criteriaMet = true;
    for (const criteria of badge.criteria) {
      if (criteria.type === 'distinct_moods') {
        if (distinctMoods.size < (criteria.value as number)) criteriaMet = false;
      } else if (criteria.type === 'mood_streak') {
        if (userData.moodStreak < (criteria.value as number)) criteriaMet = false;
      }
      if (!criteriaMet) break;
    }

    if (criteriaMet) {
      earnedBadges.push({
        badgeId: badge.id,
        earnedAt: admin.firestore.Timestamp.now().toMillis(),
        seen: false,
        xpReward: badge.xpReward
      });
    }
  }
  return earnedBadges;
}