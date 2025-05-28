/**
 * Main entry point for all Firebase Cloud Functions for Vibe-Loop Gamification.
 */

// Initialize Firebase Admin SDK
import * as admin from 'firebase-admin';
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Export gamification trigger functions
export { initializeUserGamification } from './gamificationTriggers';
export { processMoodLog } from './moodProcessingTrigger';
export { processSongPlay } from './songPlayProcessingTrigger';
export { processSeasonalAchievements } from './seasonalAchievementTrigger';
export { logAnalyticsEvent } from './logAnalytics';

// Placeholder for other function groups if any (e.g., existing dailyCard, discoveryMix)
// If you have existing functions in other files, you would export them here as well
// For example:
// export * from './dailyCard'; // Assuming dailyCard.ts exports its functions
// export * from './discoveryMix'; // Assuming discoveryMix.ts exports its functions

console.log('Vibe-Loop Cloud Functions for Gamification and Analytics initialized.');