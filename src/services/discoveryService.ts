import { Song } from '../types';
import { songs } from '../data/songs';
import { firestoreService } from './firestoreService';

/**
 * Service for handling Daily Discovery Mix functionality
 */
export class DiscoveryService {
  /**
   * Get personalized song recommendations based on user's mood and preferences
   * @param currentMood The user's current mood
   * @param limit Maximum number of songs to return
   * @returns Array of recommended songs
   */
  async getDailyDiscoveryMix(currentMood: string | null, limit: number = 5): Promise<Song[]> {
    try {
      // Try to get personalized recommendations from cloud function
      try {
        // Import firebase functions
        const { getFunctions, httpsCallable } = await import('firebase/functions');
        const functions = getFunctions();
        const generateDailyMixFn = httpsCallable(functions, 'generateDailyMix');
        
        // Call the cloud function with current mood
        const result = await generateDailyMixFn({ currentMood });
        const recommendations = result.data?.recommendations;
        
        if (recommendations && recommendations.length > 0) {
          // Convert recommendations to Song type
          const recommendedSongs = recommendations.map(rec => ({
            id: rec.id,
            title: rec.title,
            artist: rec.artist,
            albumArt: rec.coverImageUrl,
            duration: rec.duration || 0,
            audioSrc: rec.audioUrl,
            genre: rec.genre || '',
            releaseDate: rec.releaseDate || '',
            likes: rec.popularity || 0,
            mood: [rec.mood]
          }));
          
          return this.shuffleArray(recommendedSongs).slice(0, limit);
        }
      } catch (functionError) {
        console.warn('Cloud function unavailable, falling back to local recommendations:', functionError);
      }
      
      // Fall back to local recommendations if cloud function fails
      return this.getLocalRecommendations(currentMood, limit);
    } catch (error) {
      console.error('Error in getDailyDiscoveryMix:', error);
      throw error;
    }
  }
  
  /**
   * Generate local recommendations based on mood and song popularity
   * @param currentMood The user's current mood
   * @param limit Maximum number of songs to return
   * @returns Array of recommended songs
   */
  private getLocalRecommendations(currentMood: string | null, limit: number): Song[] {
    let recommendedSongs: Song[] = [];
    
    // If user has a current mood, prioritize songs matching that mood
    if (currentMood) {
      // Get songs that match the current mood
      const moodSongs = songs.filter(song => 
        song.mood && song.mood.includes(currentMood)
      );
      
      // Add some mood-based songs to recommendations
      recommendedSongs = [...moodSongs.slice(0, Math.min(3, moodSongs.length))];
    }
    
    // Add some trending songs (high likes) that aren't already in recommendations
    const trendingSongs = [...songs]
      .sort((a, b) => b.likes - a.likes)
      .filter(song => !recommendedSongs.some(rec => rec.id === song.id));
    
    recommendedSongs = [
      ...recommendedSongs,
      ...trendingSongs.slice(0, Math.min(limit - recommendedSongs.length, trendingSongs.length))
    ];
    
    // Shuffle the recommendations for variety
    return this.shuffleArray(recommendedSongs).slice(0, limit);
  }
  
  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param array Array to shuffle
   * @returns Shuffled array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

// Export a singleton instance
export const discoveryService = new DiscoveryService();
export default discoveryService;