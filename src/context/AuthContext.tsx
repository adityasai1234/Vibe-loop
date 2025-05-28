import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth, User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// Interface for the context type (not exported directly but used by useAuth)
interface AuthContextType { 
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUserProfileData: (profileData: Partial<UserProfile>) => Promise<void>;
}

// Context object (not exported directly)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Named export: AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as Auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data() as UserProfile;
          setUserProfile(profileData);
          if (!profileData.username) {
            // Only navigate if not already on choose-username or login page to avoid loops
            if (window.location.pathname !== '/choose-username' && window.location.pathname !== '/login') {
              navigate('/choose-username');
            }
          }
        } else {
          // User document doesn't exist, might be first login after Google sign-in
          setUserProfile({ 
            uid: user.uid, 
            email: user.email, 
            displayName: user.displayName, 
            photoURL: user.photoURL 
          });
          // Only navigate if not already on choose-username or login page
          if (window.location.pathname !== '/choose-username' && window.location.pathname !== '/login') {
            navigate('/choose-username');
          }
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth as Auth, provider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const initialProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        };
        setUserProfile(initialProfile);
        navigate('/choose-username');
      } else {
        const profileData = userDocSnap.data() as UserProfile;
        setUserProfile(profileData);
        if (!profileData.username) {
          navigate('/choose-username');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth as Auth);
      setCurrentUser(null);
      setUserProfile(null);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      setLoading(false);
    }
  };

  const setUserProfileData = async (profileData: Partial<UserProfile>) => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        // Ensure createdAt is only set on creation, not on every update
        const dataToSet = { ...profileData };
        if (profileData.createdAt === undefined && userProfile?.createdAt === undefined) {
          dataToSet.createdAt = serverTimestamp();
        }
        
        await setDoc(userDocRef, dataToSet, { merge: true });
        setUserProfile(prevProfile => ({
          ...(prevProfile ?? {}), // Handle case where prevProfile might be null
          ...dataToSet,
          uid: currentUser.uid,
          email: currentUser.email,
        } as UserProfile));
      } catch (error) {
        console.error("Error updating user profile: ", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, signInWithGoogle, signOut, setUserProfileData }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Named export: useAuthContext hook (renamed from useAuth)
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Named export: UserProfile interface
export interface UserProfile { 
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  username?: string;
  bio?: string;
  themeColor?: string;
  earnedBadges?: string[];
  createdAt?: any; // Firestore ServerTimestamp
  // Add other profile fields as needed
}
