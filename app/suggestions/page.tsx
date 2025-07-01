'use client'

import React, { useState, useEffect } from "react";

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

const moodEmojis = ["😃", "😊", "😎", "🥳", "😢", "😡", "😴", "🤩", "😇", "🤔", "😌", "😭", "😤", "😍", "😬", "😱", "😆", "😐", "😃", "🥰"];

function getRandomMoodEmoji() {
  return moodEmojis[Math.floor(Math.random() * moodEmojis.length)];
}

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<{text: string, emoji: string}[]>([]);
  const [input, setInput] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [randomSongs, setRandomSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mood journal state
  const [moodText, setMoodText] = useState("");
  const [moodEmoji, setMoodEmoji] = useState("");
  const [moodEntries, setMoodEntries] = useState<{emoji: string, text: string, time: string}[]>([]);

  // Set random emoji on client after mount
  useEffect(() => {
    setMoodEmoji(getRandomMoodEmoji());
    setSelectedEmoji(getRandomMusicEmoji());
  }, []);

  // Fetch mood logs on mount
  useEffect(() => {
    async function fetchMoodLogs() {
      try {
        const res = await fetch("/api/mood-log");
        if (!res.ok) return;
        const data = await res.json();
        if (data.logs) setMoodEntries(data.logs);
      } catch {}
    }
    fetchMoodLogs();
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

  // Mood journal handlers
  async function handleMoodSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (moodText.trim()) {
      // Check for sad words
      const sadWords = ["low", "sad", "not well"];
      const lowerText = moodText.toLowerCase();
      let emojiToUse = moodEmoji;
      for (const word of sadWords) {
        if (lowerText.includes(word)) {
          emojiToUse = "😢";
          break;
        }
      }
      const log = { emoji: emojiToUse, text: moodText, time: new Date().toLocaleString() };
      setMoodEntries([log, ...moodEntries]);
      setMoodText("");
      setMoodEmoji(getRandomMoodEmoji());
      // Store in S3 via API
      try {
        await fetch("/api/mood-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(log),
        });
      } catch (err) {
        // Optionally handle error
      }
    }
  }

  function handleRandomMoodEmoji() {
    setMoodEmoji(getRandomMoodEmoji());
  }

  const now = new Date();
  const currentTimeOfDay = getTimeOfDay(now);
  const timeEmoji = timeOfDayEmojis[currentTimeOfDay];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {/* Mood Journal Section */}
      <div className="w-full max-w-md mb-8 p-4 border rounded bg-background/80">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">Mood Journal <span>{moodEmoji}</span></h2>
        <form onSubmit={handleMoodSubmit} className="flex gap-2 mb-2">
          <button type="button" onClick={handleRandomMoodEmoji} className="text-2xl px-2" title="Random mood emoji">{moodEmoji}</button>
          <input
            type="text"
            value={moodText}
            onChange={e => setMoodText(e.target.value)}
            placeholder="How are you feeling?"
            className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring"
          />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Log</button>
        </form>
        {moodEntries.length > 0 && (
          <div className="mt-2 text-muted-foreground">
            <div className="font-semibold">Latest Mood:</div>
            <div className="flex items-center gap-2 text-lg">{moodEntries[0].emoji} {moodEntries[0].text} <span className="text-xs text-muted-foreground">({moodEntries[0].time})</span></div>
            <div className="mt-4">
              <div className="font-semibold mb-1">Mood Log:</div>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {moodEntries.map((entry, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-base">
                    <span>{entry.emoji}</span> {entry.text} <span className="text-xs text-muted-foreground">({entry.time})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

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