"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "@/components/audio-player"
import { EditSongDialog } from "@/components/edit-song-dialog"
import { DeleteSongDialog } from "@/components/delete-song-dialog"
import { Edit, Trash2, Music } from "lucide-react"
import { formatFileSize, formatDuration } from "@/lib/utils"

interface Song {
  id: string
  _id?: string
  title: string
  artist: string
  genre?: string | null
  file_url: string
  file_name: string
  duration?: number | null
  file_size: number
  user_id: string
  created_at: string | Date
  updated_at: string | Date
}

interface SongCardProps {
  song: Song
}

export function SongCard({ song }: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{song.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)} className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <AudioPlayer src={song.file_url} isPlaying={isPlaying} onPlayPause={setIsPlaying} />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {song.genre && (
                <Badge variant="secondary" className="text-xs">
                  {song.genre}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {song.duration && <span>{formatDuration(song.duration)}</span>}
              <span>{formatFileSize(song.file_size)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditSongDialog song={song} open={showEditDialog} onOpenChange={setShowEditDialog} />

      <DeleteSongDialog song={song} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
    </>
  )
}
