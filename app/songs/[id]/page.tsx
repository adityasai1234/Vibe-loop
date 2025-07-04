'use client'

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  likes: number;
  uploadedAt: string;
}

export default function SongPage({ params }: { params: { id: string } }) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSong() {
      try {
        const res = await fetch(`/api/songs/${params.id}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        if (data.song) {
          setSong(data.song);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching song:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSong();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-md w-full bg-card/80 rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading song...</p>
        </div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="max-w-md w-full bg-card/80 rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Song Not Found</h1>
          <p className="text-muted-foreground">The song you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-md w-full bg-card/80 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2 text-center">{song.title}</h1>
        <p className="text-center text-muted-foreground mb-4">by {song.artist}</p>
        <audio controls src={song.audioUrl} className="w-full mb-4" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Likes: {song.likes}</span>
          <span>Uploaded: {new Date(song.uploadedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
} 