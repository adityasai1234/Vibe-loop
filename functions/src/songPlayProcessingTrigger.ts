import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { 
    UserGamificationData, 
    BadgeDefinition, 
    SongPlayLog, 
    EarnedBadge, 
    BadgeType, 
    calculateLevel 
} from './types/gamification'; // Adjust path as needed

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

const XP_FOR_SONG_PLAY = 5; // Define XP reward for logging a song play (can be 0 if badges are the main reward)

/**
 * Processes new song play logs to award Genre Collector badges.
 * Triggered when a new document is created in `/user_song_plays/{logId}`.
 */
export const processSongPlay = functions.firestore
  .document('user_song_plays/{logId}')
  .onCreate(async (snap, context) => {
    const songPlayLog = snap.data() as SongPlayLog;
    const userId = songPlayLog.userId;

    if (!userId || !songPlayLog.genre) {
        functions.logger.error('SongPlayLog missing userId or genre', { songPlayLogId: snap.id });
        return null;
    }

    const gamificationRef = db.collection('user_gamification').doc(userId);

    try {
      return await db.runTransaction(async (transaction) => {
        const gamificationDoc = await transaction.get(gamificationRef);
        let userData: UserGamificationData;

        if (!gamificationDoc.exists) {
          functions.logger.warn(`UserGamificationData not found for user ${userId}, cannot process song play.`);
          // If this happens, it's an issue as user gamification should be initialized.
          // For robustness, one might initialize it here, but it's better to ensure prior initialization.
          return null; 
        } else {
          userData = gamificationDoc.data() as UserGamificationData;
        }

        // 1. Update XP (optional, could be small or 0)
        userData.xp += XP_FOR_SONG_PLAY;
        userData.level = calculateLevel(userData.xp);

        // 2. Check for Genre Collector Badges
        const newGenreCollectorBadges = await checkGenreCollectorBadges(userId, userData, songPlayLog.genre, transaction);
        newGenreCollectorBadges.forEach(badge => {
          if (!userData.genreCollectorBadges.find(b => b.badgeId === badge.badgeId)) {
            userData.genreCollectorBadges.push(badge);
            userData.xp += badge.xpReward; // Add XP for new badge
          }
        });
        userData.level = calculateLevel(userData.xp); // Recalculate level after badge XP

        transaction.set(gamificationRef, userData);
        functions.logger.info(`Processed song play for user ${userId} in genre ${songPlayLog.genre}`, { newXP: userData.xp });
        return null;
      });
    } catch (error) {
      functions.logger.error(`Error processing song play for user ${userId}:`, error);
      throw new functions.https.HttpsError('internal', 'Failed to process song play log.');
    }
  });

/**
 * Checks and awards Genre Collector badges based on distinct genres listened to or songs within a genre.
 */
async function checkGenreCollectorBadges(
  userId: string, 
  userData: UserGamificationData, 
  currentGenre: string,
  transaction: admin.firestore.Transaction
): Promise<(EarnedBadge & { xpReward: number })[]> {
  const earnedBadges: (EarnedBadge & { xpReward: number })[] = [];
  const badgeDefinitionsSnapshot = await db.collection('badge_definitions')
                                         .where('type', '==', BadgeType.GENRE_COLLECTOR)
                                         .get();

  if (badgeDefinitionsSnapshot.empty) return [];

  // Fetch all song play logs for the user to count distinct genres and songs per genre
  // This could be very read-intensive. Consider summary documents or aggregations for performance.
  const songPlaysSnapshot = await db.collection('user_song_plays')
                                    .where('userId', '==', userId)
                                    .get();
  
  const distinctGenres = new Set<string>();
  const songsPerGenre: { [genre: string]: Set<string> } = {};

  songPlaysSnapshot.forEach(doc => {
    const play = doc.data() as SongPlayLog;
    distinctGenres.add(play.genre);
    if (!songsPerGenre[play.genre]) {
      songsPerGenre[play.genre] = new Set<string>();
    }
    songsPerGenre[play.genre].add(play.songId);
  });

  for (const doc of badgeDefinitionsSnapshot.docs) {
    const badge = doc.data() as BadgeDefinition;
    if (userData.genreCollectorBadges.find(b => b.badgeId === badge.id)) continue; // Already earned

    let criteriaMet = true;
    for (const criteria of badge.criteria) {
      if (criteria.type === 'distinct_genres') {
        if (distinctGenres.size < (criteria.value as number)) criteriaMet = false;
      } else if (criteria.type === 'songs_in_genre') {
        if (!criteria.genre || !songsPerGenre[criteria.genre] || songsPerGenre[criteria.genre].size < (criteria.value as number)) {
          criteriaMet = false;
        }
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