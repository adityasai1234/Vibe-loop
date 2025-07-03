'use client'

import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function getTimeOfDay(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

const timeOfDayEmojis: Record<string, string> = {
  morning: "🌅☀️🎶",
  afternoon: "🌞🎵🥁",
  evening: "🌇🎸🎷",
  night: "🌙✨🎧",
};

const musicEmojis = ["🎶", "🎵", "🎤", "🎧", "🎸", "🥁", "🎷", "🎹", "🪕", "🎺"];

function getRandomMusicEmoji() {
  return musicEmojis[Math.floor(Math.random() * musicEmojis.length)];
}

export default function SuggestionsPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<{text: string, emoji: string}[]>([]);
  const [input, setInput] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [randomSongs, setRandomSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  // Set random emoji on client after mount
  useEffect(() => {
    setSelectedEmoji(getRandomMusicEmoji());
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      setSuggestions([{text: input, emoji: selectedEmoji}, ...suggestions]);
      setInput("");
      setSelectedEmoji(getRandomMusicEmoji());
    }
  }

  function handleRandomEmoji() {
    setSelectedEmoji(getRandomMusicEmoji());
  }

  async function handleEmojiClick() {
    setLoading(true);
    setError("");
    setRandomSongs([]);
    try {
      const res = await fetch("/api/songs");
      if (!res.ok) throw new Error("Failed to fetch songs");
      const data = await res.json();
      const songs = data.songs || [];
      if (songs.length === 0) {
        setError("No songs uploaded yet.");
        setLoading(false);
        return;
      }
      // Filter by time of day
      const now = new Date();
      const currentTimeOfDay = getTimeOfDay(now);
      const filtered = songs.filter((song: any) => {
        const uploadedDate = new Date(song.uploadedAt);
        return getTimeOfDay(uploadedDate) === currentTimeOfDay;
      });
      const pool = filtered.length > 0 ? filtered : songs; // fallback to all if none match
      const shuffled = pool.sort(() => 0.5 - Math.random());
      setRandomSongs(shuffled.slice(0, 3));
    } catch (err: any) {
      setError(err.message || "Error fetching songs");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <></>;
  }

  const now = new Date();
  const currentTimeOfDay = getTimeOfDay(now);
  const timeEmoji = timeOfDayEmojis[currentTimeOfDay];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <button onClick={handleEmojiClick} className="hover:scale-125 transition-transform" title="Show random songs">
          <span role="img" aria-label="music">🎵</span>
        </button>
        Music Suggestions
      </h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 items-center">
        <button type="button" onClick={handleRandomEmoji} className="text-2xl px-2" title="Random music emoji">{selectedEmoji}</button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Suggest a song or artist..."
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Suggest</button>
      </form>
      <ul className="w-full max-w-md space-y-2 mb-8">
        {suggestions.length === 0 ? (
          <li className="text-muted-foreground text-center">No suggestions yet. Be the first! 🎤</li>
        ) : (
          suggestions.map((s, i) => (
            <li key={i} className="bg-background/80 border rounded px-4 py-2 shadow-sm flex items-center gap-2">{s.emoji} {s.text}</li>
          ))
        )}
      </ul>
      {/* Random Songs Section */}
      <div className="w-full max-w-md">
        {loading && <div className="text-center text-muted-foreground">Loading random songs...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {randomSongs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-center mb-2">
              {timeEmoji} Random Songs ({currentTimeOfDay.toUpperCase()}) {timeEmoji}
            </h2>
            {randomSongs.map((song, idx) => (
              <div key={song.id || idx} className="border rounded p-3 bg-background/80 flex flex-col gap-1">
                <div className="font-bold flex items-center gap-2">{getRandomMusicEmoji()} {song.title}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">by {song.artist} {getRandomMusicEmoji()}</div>
                <audio controls src={song.audioUrl} className="w-full mt-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 