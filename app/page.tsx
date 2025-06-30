import { Suspense } from "react"
import { SongList } from "@/components/song-list"
import { UploadSong } from "@/components/upload-song"
import { DashboardHeader } from "@/components/dashboard-header"
import { SongListSkeleton } from "@/components/song-list-skeleton"

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Your Music Library
          </h1>
          <p className="text-muted-foreground">Upload, manage, and play your favorite songs</p>
        </div>
        <div className="mb-8">
          <UploadSong />
        </div>
        <Suspense fallback={<SongListSkeleton />}>
          <SongList />
        </Suspense>
      </main>
    </div>
  )
}
