"use client"

import { useEffect, useState } from "react"
import { SongCard } from "@/components/song-card"
import { SongListSkeleton } from "@/components/song-list-skeleton"

interface Song {
  id: string
  title: string
  artist: string
  audioUrl: string
  likes: number
  uploadedAt: string
}

interface SongsResponse {
  songs: Song[]
}

async function fetchSongs(): Promise<SongsResponse> {
  const response = await fetch('/api/songs')
  if (!response.ok) {
    throw new Error("Failed to fetch songs")
  }
  return response.json()
}

export function SongList() {
  const [songs, setSongs] = useState<Song[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchSongs()
        setSongs(data.songs)
      } catch (err) {
        setError('Failed to load songs')
        console.error('Error fetching songs:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSongs()
  }, [])

  // Function to refresh songs (called from SongCard when uploading)
  const refreshSongs = async () => {
    try {
      const data = await fetchSongs()
      setSongs(data.songs)
    } catch (err) {
      console.error('Error refreshing songs:', err)
    }
  }

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

  if (!songs.length) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2">No music yet!</h3>
          <p className="text-muted-foreground">
            Be the first to upload a track and get the party started! 🎵
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <SongCard 
            key={song.id} 
            song={song} 
            onLikeUpdate={refreshSongs}
          />
        ))}
      </div>
    </div>
  )
}
