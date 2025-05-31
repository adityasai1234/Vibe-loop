import React, { createContext, useContext, useState, ReactNode } from 'react';

/* ----------------------------  types  ---------------------------- */
interface User {
  id: string;
  uid: string;
  name?: string;
  username?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  signOutUser: () => Promise<void>;
}

/* ---------------------------  context  --------------------------- */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signOutUser = async () => {
    setLoading(true);
    // …sign-out logic here…
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/* -----------------------------  hook  ---------------------------- */
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
};

/* optional alias so old code can still do `import { useAuth } …` */
export const useAuth = useAuthContext;