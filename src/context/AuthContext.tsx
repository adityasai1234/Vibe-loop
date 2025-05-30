// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Context (NOTE: `null`, not `undefined`)                             */
/* ------------------------------------------------------------------ */
const AuthContext = createContext<AuthContextType | null>(null);

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getAuth();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /* --------------------  auth state listener  -------------------- */
  useEffect(() => {
    const stop = onAuthStateChanged(auth, async fbUser => {
      try {
        if (fbUser) {
          const user: User = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          };
          setCurrentUser(user);

          const snap = await getDoc(doc(db, 'users', fbUser.uid));
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            const blank: UserProfile = {
              username: '',
              email: fbUser.email ?? undefined,
              displayName: fbUser.displayName ?? undefined,
              photoURL: fbUser.photoURL ?? undefined,
              createdAt: new Date(),
              hasCompletedOnboarding: false,
            };
            await setDoc(doc(db, 'users', fbUser.uid), blank);
            setUserProfile(blank);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    });

    return stop; // cleanup
  }, [auth]);

  /* --------------------  actions  -------------------- */
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) {
        const blank: UserProfile = {
          username: '',
          email: user.email ?? undefined,
          displayName: user.displayName ?? undefined,
          photoURL: user.photoURL ?? undefined,
          createdAt: new Date(),
          hasCompletedOnboarding: false,
        };
        await setDoc(doc(db, 'users', user.uid), blank);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = useCallback(async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const registerWithEmail = async () => {/* stub */};
  const resetPassword     = async () => {/* stub */};

  const setUserProfileData = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      setLoading(true);
      const ref = doc(db, 'users', currentUser.uid);
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
      setUserProfile(prev => (prev ? { ...prev, ...data } : prev));
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    error,
    signInWithGoogle,
    signOutUser,
    registerWithEmail,
    resetPassword,
    setUserProfileData,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ------------------------------------------------------------------ */
/* Hook everyone else uses                                            */
/* ------------------------------------------------------------------ */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

/* optional alias so old code keeps working */
export const useAuthContext = useAuth;