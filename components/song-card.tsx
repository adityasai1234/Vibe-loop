"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AudioPlayer } from "@/components/audio-player"
import { Heart, Music, Calendar, Share2 } from "lucide-react"

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
  isPlaying?: boolean
  onPlayPause?: (playing: boolean) => void
}

export function SongCard({ song, onLikeUpdate, isPlaying = false, onPlayPause }: SongCardProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [currentLikes, setCurrentLikes] = useState(song.likes)
  const [isSharing, setIsSharing] = useState(false)

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

  const handleShare = async () => {
    if (isSharing) return

    try {
      setIsSharing(true)
      
      // Create share data
      const shareUrl = window.location.origin + `/songs/${song.id}`;
      const shareData = {
        title: `${song.title} by ${song.artist}`,
        text: `Check out this amazing song: ${song.title} by ${song.artist}`,
        url: shareUrl,
      }

      // Try native sharing first
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`
        await navigator.clipboard.writeText(shareText)
        
        // Show success message (you can add a toast notification here)
        alert('Song link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing song:', error)
      alert('Failed to share song')
    } finally {
      setIsSharing(false)
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
            onPlayPause={onPlayPause || (() => {})} 
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(song.uploadedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center gap-2 hover:text-blue-500 transition-colors"
              title="Share song"
            >
              <Share2 className={`h-4 w-4 ${isSharing ? 'animate-pulse' : ''}`} />
            </Button>
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
        </div>
      </CardContent>
    </Card>
  )
}
