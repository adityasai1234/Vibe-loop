import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from './firebase';
import FirestoreService from './FirestoreService';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Set persistence on initialization
  useEffect(() => {
    const setupPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('Error setting persistence:', error);
      }
    };
    
    setupPersistence();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userExists = await FirestoreService.userExists(user.uid);
      
      // If user doesn't exist, create a new document
      if (!userExists) {
        await FirestoreService.createUser(user.uid, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          currentStreak: 0,
          ep: 0, // Emotion Points
          moodLogs: [],
          joinedAt: serverTimestamp()
        });
      }
      
      return user;
    } catch (error) {
      console.error('Error signing in with Google', error);
      setAuthError(error.message || 'Failed to sign in with Google');
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      setAuthError(error.message || 'Failed to sign out');
      throw error;
    }
  };

  // Set up an observer for changes to the user's sign-in state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in
          setCurrentUser(user);
          
          // Check if user exists in Firestore
          const userExists = await FirestoreService.userExists(user.uid);
          
          // If user doesn't exist (rare case), create a new document
          if (!userExists) {
            await FirestoreService.createUser(user.uid, {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              currentStreak: 0,
              ep: 0,
              moodLogs: [],
              joinedAt: serverTimestamp()
            });
          }
        } else {
          // User is signed out
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change handler', error);
      } finally {
        setLoading(false);
      }
    });

    // Clean up subscription on unmount
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    signInWithGoogle,
    logout,
    loading,
    authError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}
