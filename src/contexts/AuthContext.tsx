// src/contexts/AuthContext.tsx
import { createContext, useContext, useState } from "react";

type Auth = { uid: string | null };
const AuthCtx = createContext<Auth>({ uid: null });

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [uid, setUid] = useState<string|null>(null);
  return <AuthCtx.Provider value={{ uid }}>{children}</AuthCtx.Provider>;
};

export const useAuthContext = () => useContext(AuthCtx);