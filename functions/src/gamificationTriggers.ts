import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { UserGamificationData, calculateLevel } from './types/gamification'; // Assuming types are accessible

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export const initializeUserGamification = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userId = context.params.userId;
    const newUserGamificationData: UserGamificationData = {
      userId: userId,
      xp: 0,
      level: calculateLevel(0),
      moodStreak: 0,
      longestMoodStreak: 0,
      seasonalAchievements: [],
      moodExplorerBadges: [],
      genreCollectorBadges: [],
      currentStreakMultiplier: 1.0,
      // lastMoodLogDate and lastStreakMultiplierUpdate can be undefined initially
    };

    try {
      await db.collection('user_gamification').doc(userId).set(newUserGamificationData);
      functions.logger.info(`Initialized gamification data for user ${userId}`);
      return null;
    } catch (error) {
      functions.logger.error(`Error initializing gamification data for user ${userId}:`, error);
      throw new functions.https.HttpsError('internal', 'Failed to initialize gamification data.');
    }
  });

/**
 * Placeholder for a function to copy gamification types to the functions directory.
 * In a real CI/CD pipeline, types would be shared or built into the functions deployment package.
 */
async function copyGamificationTypes() {
  console.log('Conceptual step: Ensure gamification types are available to Cloud Functions.');
}
