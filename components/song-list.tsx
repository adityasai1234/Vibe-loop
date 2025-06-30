"use client"

import { useQuery } from "@tanstack/react-query"
import { SongCard } from "@/components/song-card"
import { SongListSkeleton } from "@/components/song-list-skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface Song {
  id: string
  title: string
  artist: string
  genre: string | null
  file_url: string
  file_name: string
  duration: number | null
  file_size: number
  user_id: string
  created_at: string
  updated_at: string
}

interface SongsResponse {
  songs: Song[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

async function fetchSongs(page: number): Promise<SongsResponse> {
  const response = await fetch(`/api/songs?page=${page}&limit=12`)
  if (!response.ok) {
    throw new Error("Failed to fetch songs")
  }
  return response.json()
}

export function SongList() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ["songs", currentPage],
    queryFn: () => fetchSongs(currentPage),
  })

  if (isLoading) {
    return <SongListSkeleton />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load songs. Please try again.</p>
      </div>
    )
  }

  if (!data?.songs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No songs uploaded yet. Upload your first song to get started!</p>
      </div>
    )
  }

  const { songs, pagination } = data

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
