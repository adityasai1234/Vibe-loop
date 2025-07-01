"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Music, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UploadSong() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const { toast } = useToast()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return

    const maxSize = 20 * 1024 * 1024 // 20MB
    if (selectedFile.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${formatFileSize(maxSize)}`,
        variant: "destructive",
      })
      return
    }

    if (!selectedFile.type.startsWith("audio/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an audio file",
        variant: "destructive",
      })
      return
    }

    setFile(selectedFile)

    // Auto-fill title from filename if empty
    if (!title) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "")
      setTitle(nameWithoutExt)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileChange(droppedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !title || !artist) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("artist", artist)

      const response = await fetch("/api/songs", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to upload song")
      }

      toast({
        title: "Song uploaded successfully!",
        description: "Your song has been shared with the world 🎵",
      })

      // Reset form
      setFile(null)
      setTitle("")
      setArtist("")

      // Reload the page to show the new song
      window.location.reload()

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center justify-center">
          <Upload className="h-5 w-5" />
          Share Your Music
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragOver 
                ? "border-primary bg-primary/10 scale-[1.02]" 
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <Music className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drop your audio file here</p>
                <p className="text-muted-foreground mb-4">
                  or click to browse (max 20MB)
                </p>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="max-w-xs mx-auto cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Song Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Song Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter song title"
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artist Name *</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter artist name"
                required
                className="bg-background/50"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isUploading || !file || !title || !artist} 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading your track...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload & Share
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
