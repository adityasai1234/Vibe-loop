import { getUserGenres, saveUserGenres } from '../services/profileService';
import { auth } from '../firebase/firebase';

/**
 * Fetches the current user's genre preferences
 * @returns {Promise<Object>} Response object with genres or error
 */
export const fetchUserGenres = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'User not authenticated', status: 401 };
    }
    
    const genres = await getUserGenres(user.uid);
    return { data: genres, status: 200 };
  } catch (error) {
    console.error('API error fetching genres:', error);
    return { 
      error: error.message || 'Failed to fetch genre preferences', 
      status: 500 
    };
  }
};

/**
 * Updates the current user's genre preferences
 * @param {string[]} genres - Array of genre strings to save
 * @returns {Promise<Object>} Response object with success or error
 */
export const updateUserGenres = async (genres) => {
  try {
    // Validate input
    if (!Array.isArray(genres)) {
      return { 
        error: 'Genres must be an array', 
        status: 400 
      };
    }
    
    if (genres.length > 5) {
      return { 
        error: 'Maximum 5 genres allowed', 
        status: 400 
      };
    }
    
    const user = auth.currentUser;
    if (!user) {
      return { error: 'User not authenticated', status: 401 };
    }
    
    await saveUserGenres(user.uid, genres);
    return { 
      data: { message: 'Genre preferences updated successfully' }, 
      status: 200 
    };
  } catch (error) {
    console.error('API error updating genres:', error);
    return { 
      error: error.message || 'Failed to update genre preferences', 
      status: 500 
    };
  }
};