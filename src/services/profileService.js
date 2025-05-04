import { firestore } from '../firebase/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

/**
 * Fetches a user's favorite genres from Firestore
 * @param {string} userId - The user's ID
 * @returns {Promise<string[]>} - Array of genre strings
 */
export const getUserGenres = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.favoriteGenres || [];
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, { favoriteGenres: [] });
      return [];
    }
  } catch (error) {
    console.error('Error fetching user genres:', error);
    throw error;
  }
};

/**
 * Saves a user's favorite genres to Firestore
 * @param {string} userId - The user's ID
 * @param {string[]} genres - Array of genre strings
 * @returns {Promise<void>}
 */
export const saveUserGenres = async (userId, genres) => {
  try {
    // Validate input
    if (!Array.isArray(genres)) {
      throw new Error('Genres must be an array');
    }
    
    if (genres.length > 5) {
      throw new Error('Maximum 5 genres allowed');
    }
    
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing document
      await updateDoc(userRef, {
        favoriteGenres: genres,
        updatedAt: new Date()
      });
    } else {
      // Create new document
      await setDoc(userRef, {
        favoriteGenres: genres,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error saving user genres:', error);
    throw error;
  }
};

/**
 * Gets user profile data
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
