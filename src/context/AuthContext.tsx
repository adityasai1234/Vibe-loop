import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// NOTE: Firebase imports and navigate are removed as they are not in the user's example structure
// If they are needed, they should be re-added and integrated into the new login/logout logic.

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserProfile {
  username: string;
  bio?: string;
  avatarUrl?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
  displayName?: string;
  email?: string;
  photoURL?: string;
  themeColor?: string;
  createdAt?: Date;
  hasCompletedOnboarding?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  setUserProfileData: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const auth = getAuth();

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribeAuth: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener
        unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          try {
            if (firebaseUser) {
              // Convert Firebase user to our User type
              const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL
              };
              setCurrentUser(user);

              // Fetch user profile from Firestore
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                setUserProfile(userDoc.data() as UserProfile);
              } else {
                // Create initial profile if it doesn't exist
                const initialProfile: UserProfile = {
                  username: '',
                  email: firebaseUser.email || undefined,
                  displayName: firebaseUser.displayName || undefined,
                  photoURL: firebaseUser.photoURL || undefined,
                  createdAt: new Date(),
                  hasCompletedOnboarding: false
                };
                await setDoc(doc(db, 'users', firebaseUser.uid), initialProfile);
                setUserProfile(initialProfile);
              }
            } else {
              // Clear all user data when signed out
              setCurrentUser(null);
              setUserProfile(null);
            }
          } catch (err) {
            console.error('Error in auth state change:', err);
            setError(err as Error);
          } finally {
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Error setting up auth listener:', err);
        setError(err as Error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
    };
  }, [auth]);

  // Memoize signOutUser to prevent unnecessary re-renders
  const signOutUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      
      // Clear local state (though this should also happen via onAuthStateChanged)
      setCurrentUser(null);
      setUserProfile(null);
      
      // Note: No need to manually clear tokens as Firebase handles this
      // The onAuthStateChanged listener will trigger and update the state
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        // Create initial profile for new users
        const initialProfile: UserProfile = {
          username: '',
          email: result.user.email || undefined,
          displayName: result.user.displayName || undefined,
          photoURL: result.user.photoURL || undefined,
          createdAt: new Date(),
          hasCompletedOnboarding: false
        };
        await setDoc(doc(db, 'users', result.user.uid), initialProfile);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Implement email registration logic
      // This is a placeholder
      setCurrentUser({
        uid: 'temp-uid',
        email,
        displayName: null,
        photoURL: null
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      // Implement password reset logic
      // This is a placeholder
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const setUserProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Update Firestore
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signInWithGoogle,
    signOutUser,
    registerWithEmail,
    resetPassword,
    setUserProfileData,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// UserProfile interface is removed as it's not part of the user's direct example for AuthContext.tsx
// If it's used by the 'user: any' type, it should be defined elsewhere or inline.
