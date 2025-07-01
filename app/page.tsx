import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Music, Play } from "lucide-react"

export default function HomePage(): JSX.Element {
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

      {/* Hero Section */}
      <main className="flex-1">
        {/* Hero */}
        <section className="container flex flex-col items-center justify-center gap-8 py-12 text-center md:gap-10 md:py-16">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl md:text-6xl">
            Share Your Music
            <br className="hidden sm:inline" />with the&nbsp;
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
              World
            </span>
          </h1>
          <p className="max-w-[660px] text-lg text-muted-foreground md:text-xl">
            Upload your favorite tracks, discover amazing music from others, and show some love with likes. No sign-up required — just pure music sharing.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg">
                <Play className="h-4 w-4 mr-2" /> Start Sharing Music
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

        {/* Features */}
        <section className="container grid gap-8 pb-16 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Upload Music</h3>
            <p className="text-sm text-muted-foreground">Share your tracks with the community.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Discover Music</h3>
            <p className="text-sm text-muted-foreground">Browse and play songs from others.</p>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
              <span className="text-lg">❤️</span>
            </div>
            <h3 className="text-lg font-semibold">Show Love</h3>
            <p className="text-sm text-muted-foreground">Like your favorite tracks.</p>
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
  )
}
