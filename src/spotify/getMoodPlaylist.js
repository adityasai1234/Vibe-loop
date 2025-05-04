import axios from 'axios';
import { getUserGenres } from '../services/profileService';
import { auth } from '../firebase/firebase';

/**
 * Get a personalized playlist based on mood and user preferences
 * @param {string} token - Spotify API token
 * @param {Object} moodParams - Parameters for mood-based recommendations
 * @returns {Promise<Array>} - Array of track objects
 */
export async function getMoodPlaylist(token, moodParams) {
  // Check for required parameters
  if (
    !token ||
    !moodParams ||
    typeof moodParams.valence !== "number" ||
    typeof moodParams.energy !== "number"
  ) {
    console.error("Invalid parameters for getMoodPlaylist:", { token, moodParams });
    return [];
  }

  try {
    // Get user's favorite genres if available
    let genres = [];
    
    // If genres not provided in moodParams, try to get from user preferences
    if (!moodParams.genres || !Array.isArray(moodParams.genres) || moodParams.genres.length === 0) {
      const user = auth.currentUser;
      if (user) {
        try {
          genres = await getUserGenres(user.uid);
        } catch (error) {
          console.error("Error fetching user genres:", error);
        }
      }
    } else {
      genres = moodParams.genres;
    }
    
    // If still no genres, use some defaults
    if (!genres || genres.length === 0) {
      genres = ['pop', 'rock', 'hip-hop', 'electronic', 'indie'];
    }
    
    // Limit to 5 genres as that's Spotify's maximum for seed_genres
    genres = genres.slice(0, 5);

    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations',
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          seed_genres: genres.join(','),
          target_valence: moodParams.valence,
          target_energy: moodParams.energy,
          limit: 20,
        },
      }
    );
    return response.data.tracks || [];
  } catch (error) {
    console.error("Error fetching mood playlist:", error);
    return [];
  }
}
if (typeof window!== "undefined") {
  window.getMoodPlaylist = getMoodPlaylist; 
}
 else {
  console.error("getMoodPlaylist is not defined");
}
  

