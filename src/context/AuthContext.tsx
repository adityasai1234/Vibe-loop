import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

// TEMPORARY: Mock user for development without Supabase auth
const mockUser = {
  id: 'temp-user-id',
  email: 'temp@example.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  phone: undefined,
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  identities: [],
  factors: [],
} as User;

const mockSession: Session = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: mockUser,
} as Session;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  resetPassword: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  updatePassword: (password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [session, setSession] = useState<Session | null>(mockSession);
  const [loading, setLoading] = useState(false); // Set to false since we have mock data

  // TEMPORARY: Disabled Supabase auth integration
  // useEffect(() => {
  //   // Get initial session
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //     setUser(session?.user ?? null);
  //     setLoading(false);
  //   });

  //   // Listen for auth changes
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //     setUser(session?.user ?? null);
  //     setLoading(false);
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  const signUp = async (email: string, password: string) => {
    // TEMPORARY: Mock successful signup
    console.log('Mock signup:', { email, password });
    return { 
      data: { user: mockUser, session: mockSession }, 
      error: null 
    };
  };

  const signIn = async (email: string, password: string) => {
    // TEMPORARY: Mock successful signin
    console.log('Mock signin:', { email, password });
    return { 
      data: { user: mockUser, session: mockSession }, 
      error: null 
    };
  };

  const resetPassword = async (email: string) => {
    // TEMPORARY: Mock successful password reset
    console.log('Mock password reset:', { email });
    return { 
      data: { message: 'Password reset email sent' }, 
      error: null 
    };
  };

  const updatePassword = async (password: string) => {
    // TEMPORARY: Mock successful password update
    console.log('Mock password update');
    return { 
      data: { message: 'Password updated successfully' }, 
      error: null 
    };
  };

  const signOut = async () => {
    // TEMPORARY: Mock signout (doesn't actually sign out)
    console.log('Mock signout');
    // Keep the mock user logged in for development
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    resetPassword,
    updatePassword,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
