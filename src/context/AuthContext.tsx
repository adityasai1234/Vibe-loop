// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
interface User {
  id: string;
  name: string;
  uid: string;
  username?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

interface UserProfile {
  photoURL?: string;
  displayName?: string;
  email?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  currentUser: User | null;          // alias for user
  setUser: (u: User | null) => void;
  userProfile?: UserProfile;
  signOutUser: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
}

/* ------------------------------------------------------------------ */
/* Context setup                                                       */
/* ------------------------------------------------------------------ */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
};

/* Alias so older code that calls `useAuth()` keeps working */
export const useAuth = useAuthContext;

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* Simulated auth listener (replace with Firebase / Supabase, etc.) */
  useEffect(() => {
    // pretend we finish checking auth state after 1 s
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const signInWithGoogle = async () => {
    // TODO: replace with your real Google-auth flow
    console.log('Google sign-in clicked');
  };

  const signOutUser = async () => {
    // TODO: replace with your real sign-out logic
    setUser(null);
    console.log('User signed out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,   // keep both keys for convenience
        setUser,
        userProfile: undefined,
        loading,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};