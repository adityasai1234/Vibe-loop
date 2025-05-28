import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Cloud Function that generates a daily discovery mix for each user
 * This function runs on a schedule (once per day) and analyzes user's
 * listening history and mood patterns to create personalized recommendations
 */
export const generateDailyDiscoveryMix = functions.pubsub
  .schedule('0 0 * * *') // Run at midnight every day
  .timeZone('America/New_York')
  .onRun(async () => {
    try {
      // Get all users
      const usersSnapshot = await db.collection('users').get();
      
      const batch = db.batch();
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      
      // Process each user
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        
        // Get user's mood history
        const moodHistorySnapshot = await db
          .collection('users')
          .doc(userId)
          .collection('moodJournal')
          .orderBy('timestamp', 'desc')
          .limit(30) // Last 30 entries
          .get();
        
        // Get user's recently played songs
        const recentlyPlayedSnapshot = await db
          .collection('users')
          .doc(userId)
          .collection('playHistory')
          .orderBy('timestamp', 'desc')
          .limit(50) // Last 50 songs
          .get();
        
        // Get user's favorite genres and artists
        const userPreferences = userDoc.data().preferences || {};
        const favoriteGenres = userPreferences.genres || [];
        const favoriteArtists = userPreferences.artists || [];
        
        // Get most frequent mood
        const moodCounts: Record<string, number> = {};
        moodHistorySnapshot.docs.forEach(doc => {
          const mood = doc.data().mood;
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        const dominantMood = Object.entries(moodCounts)
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0])[0] || 'Neutral';
        
        // Get songs that match user preferences and mood
        const songsSnapshot = await db
          .collection('songs')
          .where('moods', 'array-contains', dominantMood)
          .limit(50)
          .get();
        
        // Filter out songs the user has recently played
        const recentSongIds = new Set(
          recentlyPlayedSnapshot.docs.map(doc => doc.data().songId)
        );
        
        const eligibleSongs = songsSnapshot.docs
          .filter(doc => !recentSongIds.has(doc.id))
          .map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Score songs based on user preferences
        const scoredSongs = eligibleSongs.map(song => {
          let score = 0;
          
          // Score based on genre match
          if (favoriteGenres.includes(song.genre)) {
            score += 2;
          }
          
          // Score based on artist match
          if (favoriteArtists.includes(song.artist)) {
            score += 3;
          }
          
          return { ...song, score };
        });
        
        // Sort by score and select top 10
        const selectedSongs = scoredSongs
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        
        // Create discovery mix document
        const mixRef = db
          .collection('users')
          .doc(userId)
          .collection('discoveryMixes')
          .doc();
        
        batch.set(mixRef, {
          title: `${dominantMood} Discovery Mix`,
          description: `Personalized for your ${dominantMood} mood`,
          songs: selectedSongs,
          createdAt: timestamp,
          mood: dominantMood
        });
      }
      
      // Commit all changes
      await batch.commit();
      
      console.log('Daily discovery mixes generated successfully');
      return null;
    } catch (error) {
      console.error('Error generating discovery mixes:', error);
      return null;
    }
  });
