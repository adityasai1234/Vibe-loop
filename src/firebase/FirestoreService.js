import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { firestore } from './firebase';

/**
 * FirestoreService provides helper functions for interacting with Firestore database
 */
const FirestoreService = {
  /**
   * Get a user document by user ID
   * @param {string} userId - The user's UID
   * @returns {Promise<Object|null>} - The user document data or null if not found
   */
  getUserById: async (userId) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  /**
   * Create a new user document in Firestore
   * @param {string} userId - The user's UID
   * @param {Object} userData - The user data to store
   * @returns {Promise<void>}
   */
  createUser: async (userId, userData) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update an existing user document
   * @param {string} userId - The user's UID
   * @param {Object} userData - The user data to update
   * @returns {Promise<void>}
   */
  updateUser: async (userId, userData) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Check if a user exists in Firestore
   * @param {string} userId - The user's UID
   * @returns {Promise<boolean>} - True if user exists, false otherwise
   */
  userExists: async (userId) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch (error) {
      console.error('Error checking if user exists:', error);
      throw error;
    }
  },

  /**
   * Add a mood log entry to a user's document
   * @param {string} userId - The user's UID
   * @param {string} mood - The mood value (e.g., 'happy', 'sad', etc.)
   * @param {string} note - The journal note text
   * @returns {Promise<Object>} - Updated user data including streak and EP
   */
  addMoodLogEntry: async (userId, mood, note) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userSnap.data();
      const lastEntryDate = userData.lastEntryDate ? new Date(userData.lastEntryDate.toDate()) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if this is a consecutive day entry
      const isConsecutiveDay = lastEntryDate ? 
        new Date(lastEntryDate.getTime() + 24 * 60 * 60 * 1000).toDateString() === today.toDateString() : false;
      
      // Calculate new streak and EP
      const newStreak = isConsecutiveDay ? (userData.currentStreak || 0) + 1 : 1;
      const epBonus = isConsecutiveDay ? 5 : 3; // More EP for streak continuation
      const newEP = (userData.ep || 0) + epBonus;
      
      // Create the mood log entry
      const moodLogEntry = {
        date: serverTimestamp(),
        mood: mood,
        note: note
      };
      
      // Update user document
      await updateDoc(userRef, {
        moodLogs: arrayUnion(moodLogEntry),
        currentStreak: newStreak,
        ep: newEP,
        lastEntryDate: serverTimestamp()
      });
      
      return {
        newStreak,
        newEP,
        epBonus,
        isConsecutiveDay
      };
    } catch (error) {
      console.error('Error adding mood log entry:', error);
      throw error;
    }
  },

  /**
   * Get all mood logs for a user
   * @param {string} userId - The user's UID
   * @returns {Promise<Array>} - Array of mood log entries
   */
  getUserMoodLogs: async (userId) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return [];
      }
      
      const userData = userSnap.data();
      return userData.moodLogs || [];
    } catch (error) {
      console.error('Error getting user mood logs:', error);
      throw error;
    }
  },

  /**
   * Get user stats (streak, EP, total entries)
   * @param {string} userId - The user's UID
   * @returns {Promise<Object>} - User stats
   */
  getUserStats: async (userId) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return {
          currentStreak: 0,
          ep: 0,
          totalEntries: 0
        };
      }
      
      const userData = userSnap.data();
      return {
        currentStreak: userData.currentStreak || 0,
        ep: userData.ep || 0,
        totalEntries: (userData.moodLogs || []).length
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }
};

export default FirestoreService;
