"use client"

import { SignIn } from "@clerk/nextjs";
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0098A0] via-[#FF9800] to-[#FFB347] p-4">
      <div className="flex flex-col items-center mb-8">
        <img src="/placeholder-logo.svg" alt="VibeLoop Logo" className="h-16 w-16 mb-2" />
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#0098A0] to-[#FF9800] bg-clip-text text-transparent mb-2">VibeLoop</h1>
        <p className="text-lg text-white/80 font-medium mb-4 text-center max-w-xs">Sign in to your music library and vibe with your favorite tracks!</p>
      </div>
      <div className="max-w-md w-full p-8 border border-white/20 rounded-2xl bg-white/80 shadow-xl backdrop-blur-md flex flex-col items-center gap-6">
        <SignIn appearance={{
          elements: {
            card: "bg-transparent shadow-none border-none",
            formButtonPrimary: "bg-gradient-to-r from-[#0098A0] to-[#FF9800] text-white font-bold py-2 rounded-lg hover:from-[#00777a] hover:to-[#ff7f00] transition-all",
            headerTitle: "text-2xl font-bold text-center mb-2",
            headerSubtitle: "text-base text-center mb-4 text-muted-foreground",
          }
        }} />
      </div>
    </div>
  );
} 