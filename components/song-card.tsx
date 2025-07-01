"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AudioPlayer } from "@/components/audio-player"
import { Heart, Music, Calendar } from "lucide-react"

interface Song {
  id: string
  title: string
  artist: string
  audioUrl: string
  likes: number
  uploadedAt: string
}

interface SongCardProps {
  song: Song
  onLikeUpdate?: () => void
}

export function SongCard({ song, onLikeUpdate }: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(song.likes)

  const handleLike = async () => {
    if (isLiking) return

    try {
      setIsLiking(true)
      const response = await fetch(`/api/songs/${song.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'like' }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentLikes(data.likes)
        onLikeUpdate?.()
      }
    } catch (error) {
      console.error('Error liking song:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-primary/30 bg-card/80 backdrop-blur">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-lg">{song.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
          </div>
        </div>

        {/* Audio Player */}
        <div className="mb-4">
          <AudioPlayer 
            src={song.audioUrl} 
            isPlaying={isPlaying} 
            onPlayPause={setIsPlaying} 
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(song.uploadedAt)}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center gap-2 hover:text-red-500 transition-colors"
          >
            <Heart 
              className={`h-4 w-4 ${isLiking ? 'animate-pulse' : ''}`} 
              fill={currentLikes > 0 ? 'currentColor' : 'none'}
            />
            <span className="text-sm font-medium">{currentLikes}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
