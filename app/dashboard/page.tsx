import { Suspense } from "react"
import Link from "next/link"
import { SongList } from "@/components/song-list"
import { UploadSong } from "@/components/upload-song"
import { SongListSkeleton } from "@/components/song-list-skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import { Music, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Music Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your tracks and discover amazing music from the community
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Share Your Music
            </h2>
            <UploadSong />
          </div>
        </div>

        {/* Music Library Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Community Music
          </h2>
          <Suspense fallback={<SongListSkeleton />}>
            <SongList />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>Built with ❤️ for music lovers everywhere</p>
        </div>
      </footer>
    </div>
  )
} 