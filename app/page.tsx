'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Music, Play } from "lucide-react"
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage(): JSX.Element {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/login');
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

  if (!isSignedIn) {
    return <></>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(90deg, #0098A0 0%, #FF9800 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              VibeLoop
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container flex flex-col items-center justify-center gap-8 py-12 text-center md:gap-10 md:py-16">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl md:text-6xl">
            Welcome to VibeLoop
            <br className="hidden sm:inline" />
            <span
              style={{
                background: 'linear-gradient(90deg, #0098A0 0%, #FF9800 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              Your Music Hub
            </span>
          </h1>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg">
                <Play className="h-4 w-4 mr-2" /> Go to Dashboard
              </Button>
            </Link>
            <Link href="/suggestions">
              <Button size="lg" variant="outline">
                <span role="img" aria-label="music">🎵</span> Suggest Music
              </Button>
            </Link>
            <Link href="/mood-calendar">
              <Button size="lg" variant="outline">
                <span role="img" aria-label="calendar">📅</span> Mood Calendar
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>Built with ❤️ for music lovers everywhere</p>
        </div>
      </footer>
    </div>
  );
}
