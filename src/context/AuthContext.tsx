import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import {
  signInWithGoogle,
  loginWithEmailPassword,
  registerWithEmailPassword,
  sendPasswordReset,
  logoutUser,
} from '../services/authService';

/* ------------------------------------------------------------------ */
/* Types and Context Setup                                            */
/* ------------------------------------------------------------------ */

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/* ------------------------------------------------------------------ */
/* Provider Component                                                 */
/* ------------------------------------------------------------------ */

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------- Auth State Listener ------------------ */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return unsubscribe; // clean-up on unmount
  }, []);

  /* ------------------------------ Helpers ------------------------- */
  const clearError = () => setError(null);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      clearError();
      await loginWithEmailPassword(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      clearError();
      await registerWithEmailPassword(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      clearError();
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      clearError();
      await sendPasswordReset(email);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      clearError();
      await logoutUser();
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /* ----------------------------- Value ---------------------------- */
  const value: AuthContextType = {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    resetPassword,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/* ------------------------------------------------------------------ */
/* Hooks & Exports                                                    */
/* ------------------------------------------------------------------ */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/* Alias export so other files can import { useAuthContext } */
export { useAuth as useAuthContext };

export { auth };