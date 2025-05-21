import { https } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

/**
 * Cloud function to generate personalized daily mix recommendations
 * based on user's mood history, listening habits, and preferences
 */
export const generateDailyMix = https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new https.HttpsError(
      'unauthenticated',
      'You must be logged in to generate recommendations'
    );
  }

  const userId = context.auth.uid;
  const { currentMood } = data;
  
  try {
    // Get user data including mood history and recently played songs
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new https.HttpsError('not-found', 'User not found');
    }
    
    const userData = userDoc.data();
    const moodHistory = userData?.moodHistory || [];
    const recentlyPlayed = userData?.recentlyPlayed || [];
    const favorites = userData?.favorites || [];
    
    // Get all available songs
    const songsSnapshot = await db.collectionGroup('songs').get();
    const allSongs = songsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Generate recommendations based on multiple factors
    const recommendations = await generateRecommendations({
      allSongs,
      currentMood,
      moodHistory,
      recentlyPlayed,
      favorites,
      userId
    });
    
    // Store the recommendations for this user
    await db.collection('users').doc(userId).collection('recommendations').doc('dailyMix').set({
      songs: recommendations,
      generatedAt: new Date(),
      basedOnMood: currentMood || 'mixed'
    });
    
    return { success: true, recommendations };
  } catch (error) {
    console.error('Error generating daily mix:', error);
    throw new https.HttpsError('internal', 'Failed to generate recommendations');
  }
});

/**
 * Generate personalized recommendations based on multiple factors
 */
async function generateRecommendations({
  allSongs,
  currentMood,
  moodHistory,
  recentlyPlayed,
  favorites,
  userId
}) {
  // Calculate mood affinity scores based on user's mood history
  const moodAffinityScores = calculateMoodAffinityScores(moodHistory);
  
  // Score each song based on multiple factors
  const scoredSongs = allSongs.map(song => {
    let score = 0;
    
    // Factor 1: Current mood match (highest weight)
    if (currentMood && song.mood && song.mood.includes(currentMood)) {
      score += 10;
    }
    
    // Factor 2: Historical mood affinity
    if (song.mood) {
      song.mood.forEach(mood => {
        if (moodAffinityScores[mood]) {
          score += moodAffinityScores[mood] * 2;
        }
      });
    }
    
    // Factor 3: Avoid recently played songs
    if (recentlyPlayed.includes(song.id)) {
      score -= 5;
    }
    
    // Factor 4: Boost songs similar to favorites
    if (favorites.includes(song.id)) {
      score += 3;
    } else {
      // Check genre similarity with favorites
      const genreSimilarity = calculateGenreSimilarity(song, favorites, allSongs);
      score += genreSimilarity * 2;
    }
    
    // Factor 5: Popularity boost (small weight)
    score += (song.popularity || 0) / 20;
    
    // Factor 6: Add some randomness for discovery
    score += Math.random() * 2;
    
    return { ...song, score };
  });
  
  // Sort by score and take top 10
  const recommendations = scoredSongs
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(({ score, ...song }) => song); // Remove score from final results
  
  return recommendations;
}

/**
 * Calculate mood affinity scores based on user's mood history
 * More recent moods have higher weight
 */
function calculateMoodAffinityScores(moodHistory) {
  const scores = {};
  const now = Date.now();
  
  // Process mood history from newest to oldest
  moodHistory
    .sort((a, b) => b.timestamp - a.timestamp)
    .forEach((entry, index) => {
      const mood = entry.mood;
      const daysSinceEntry = (now - entry.timestamp) / (1000 * 60 * 60 * 24);
      
      // Exponential decay based on recency
      const weight = Math.exp(-0.1 * daysSinceEntry);
      
      scores[mood] = (scores[mood] || 0) + weight;
    });
  
  return scores;
}

/**
 * Calculate genre similarity between a song and user's favorites
 */
function calculateGenreSimilarity(song, favorites, allSongs) {
  if (!favorites.length) return 0;
  
  // Get genres of favorite songs
  const favoriteSongs = allSongs.filter(s => favorites.includes(s.id));
  const favoriteGenres = new Set();
  
  favoriteSongs.forEach(favSong => {
    if (favSong.genre) {
      favoriteGenres.add(favSong.genre);
    }
  });
  
  // Check if song's genre matches any favorite genres
  return favoriteGenres.has(song.genre) ? 1 : 0;
}