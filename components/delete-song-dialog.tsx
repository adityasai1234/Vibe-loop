"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface DeleteSongDialogProps {
  song: Song
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteSongDialog({ song, open, onOpenChange }: DeleteSongDialogProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/songs/${song.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete song")
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Song deleted successfully!",
        description: "The song has been removed from your library.",
      })

      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ["songs"] })
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Song</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{song.title}" by {song.artist}? This action cannot be undone and will
            permanently remove the song from your library and storage.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Song"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
