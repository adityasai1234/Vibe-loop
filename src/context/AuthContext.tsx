import { createContext, useContext, useState, useEffect, ReactNode } from "react"; 

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

  // useEffect for onAuthStateChanged is removed as it's not in the user's example.
  // The example implies manual login/logout calls will manage the user state.

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      // Implement Google sign-in logic
      // This is a placeholder - implement actual Google auth
      setCurrentUser({
        uid: 'temp-uid',
        email: 'user@example.com',
        displayName: 'Test User',
        photoURL: null
      });
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      setLoading(true);
      // Implement sign out logic
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err as Error);
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
    try {
      setLoading(true);
      // Implement profile update logic
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return ( 
    <AuthContext.Provider value={{ 
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
    }}> 
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
