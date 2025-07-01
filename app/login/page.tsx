'use client'

import { useAuth, useLoginWithRedirect, ContextHolder } from '@frontegg/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  const logout = () => {
    const baseUrl = ContextHolder.getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location.origin}`;
  };

  const handleContinue = () => {
    setRedirecting(true);
    router.replace('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-md w-full p-8 border rounded bg-background/80 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold">Login</h1>
        {isAuthenticated ? (
          <>
            <div className="text-lg">Welcome, {user?.name}!</div>
            <button className="bg-primary text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
            <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleContinue} disabled={redirecting}>
              {redirecting ? 'Redirecting...' : 'Continue to App'}
            </button>
          </>
        ) : (
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={() => loginWithRedirect()}>
            Login with Frontegg
          </button>
        )}
      </div>
    </div>
  );
} 