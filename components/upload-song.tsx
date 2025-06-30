"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Music, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatFileSize } from "@/lib/utils"

export function UploadSong() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [genre, setGenre] = useState("")
  const [dragOver, setDragOver] = useState(false)

  const { toast } = useToast()
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/songs", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to upload song")
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Song uploaded successfully!",
        description: "Your song has been added to your library.",
      })

      // Reset form
      setFile(null)
      setTitle("")
      setArtist("")
      setGenre("")

      // Refresh songs list
      queryClient.invalidateQueries({ queryKey: ["songs"] })
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return

    const maxSize = Number.parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "5242880")
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !title || !artist) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("artist", artist)
    formData.append("genre", genre)

    uploadMutation.mutate(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Song
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
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
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drop your audio file here</p>
                <p className="text-muted-foreground mb-4">
                  or click to browse (max{" "}
                  {formatFileSize(Number.parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "5242880"))})
                </p>
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="max-w-xs mx-auto"
                />
              </div>
            )}
          </div>

          {/* Song Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter song title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artist *</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Enter artist name"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Enter genre (optional)"
              />
            </div>
          </div>

          <Button type="submit" disabled={uploadMutation.isPending || !file || !title || !artist} className="w-full">
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Song
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
