import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { 
    UserGamificationData, 
    BadgeDefinition, 
    SeasonalConfiguration, 
    EarnedBadge, 
    BadgeType, 
    calculateLevel 
} from './types/gamification'; // Adjust path as needed

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Scheduled function to check for and award seasonal achievements.
 * Runs daily (or as configured).
 */
export const processSeasonalAchievements = functions.scheduler.onSchedule('every day 00:00', async (event) => {
  functions.logger.info('Starting seasonal achievement processing...');

  const now = admin.firestore.Timestamp.now().toMillis();

  // 1. Fetch active seasonal configurations
  const activeSeasonsSnapshot = await db.collection('seasonal_configurations')
                                      .where('active', '==', true)
                                      .where('startDate', '<=', now)
                                      // No direct 'endDate >= now' in Firestore, filter client-side or use two queries
                                      .get();

  const activeSeasons: SeasonalConfiguration[] = [];
  activeSeasonsSnapshot.forEach(doc => {
    const season = doc.data() as SeasonalConfiguration;
    if (season.endDate >= now) {
      activeSeasons.push(season);
    }
  });

  if (activeSeasons.length === 0) {
    functions.logger.info('No active seasons found.');
    return null;
  }

  functions.logger.info(`Found ${activeSeasons.length} active seasons.`);

  // 2. Fetch all badge definitions related to seasonal achievements
  const seasonalBadgeDefinitionsSnapshot = await db.collection('badge_definitions')
                                                 .where('type', '==', BadgeType.SEASONAL_ACHIEVEMENT)
                                                 .get();
  
  const seasonalBadgeMap = new Map<string, BadgeDefinition>();
  seasonalBadgeDefinitionsSnapshot.forEach(doc => {
    seasonalBadgeMap.set(doc.id, doc.data() as BadgeDefinition);
  });

  if (seasonalBadgeMap.size === 0) {
    functions.logger.info('No seasonal badge definitions found.');
    return null;
  }

  // 3. Iterate through all users (can be very resource-intensive for many users)
  // Consider processing users in batches or targeting active users.
  const usersSnapshot = await db.collection('users').get(); // This fetches ALL users.
  
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const gamificationRef = db.collection('user_gamification').doc(userId);

    try {
      await db.runTransaction(async (transaction) => {
        const gamificationDoc = await transaction.get(gamificationRef);
        if (!gamificationDoc.exists) {
          functions.logger.warn(`UserGamificationData not found for user ${userId} during seasonal check.`);
          return; // Skip if no gamification data
        }
        const userData = gamificationDoc.data() as UserGamificationData;
        let updated = false;

        for (const season of activeSeasons) {
          for (const badgeId of season.relatedBadges) {
            const badge = seasonalBadgeMap.get(badgeId);
            if (!badge) continue; // Badge definition not found or not seasonal

            // Check if user already has this seasonal badge
            if (userData.seasonalAchievements.find(b => b.badgeId === badge.id)) continue;

            // Check criteria for this seasonal badge (e.g., logged in during season, specific action)
            // This example assumes simple participation (being active during season implies earning)
            // More complex criteria would require checking user activity logs within season dates.
            let criteriaMet = true; // Placeholder for actual criteria check
            // Example: Check if user has a mood log within the season's timeframe
            // const moodLogsDuringSeason = await db.collection('user_mood_logs')
            // .where('userId', '==', userId)
            // .where('timestamp', '>=', season.startDate)
            // .where('timestamp', '<=', season.endDate)
            // .limit(1).get();
            // if(moodLogsDuringSeason.empty && badge.criteria.some(c => c.type === 'seasonal_event' && c.value === 'active_during_season')) {
            // criteriaMet = false;
            // }

            if (criteriaMet) {
              userData.seasonalAchievements.push({
                badgeId: badge.id,
                earnedAt: now,
                seen: false
              });
              userData.xp += badge.xpReward;
              updated = true;
              functions.logger.info(`Awarded seasonal badge ${badge.id} to user ${userId} for season ${season.seasonId}`);
            }
          }
        }

        if (updated) {
          userData.level = calculateLevel(userData.xp);
          transaction.set(gamificationRef, userData);
        }
      });
    } catch (error) {
      functions.logger.error(`Error processing seasonal achievements for user ${userId}:`, error);
      // Continue to next user even if one fails
    }
  }

  functions.logger.info('Seasonal achievement processing finished.');
  return null;
});