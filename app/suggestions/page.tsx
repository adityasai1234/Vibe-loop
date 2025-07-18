'use client'

import React, { useState, useEffect } from "react";

interface Suggestion {
  id: string;
  artist: string;
  youtubeUrl: string;
  createdAt: string;
  likes: number;
}

export default function SuggestionsPage() {
  const [artist, setArtist] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchSuggestions() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/suggestions");
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setError(err.message || "Error fetching suggestions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSuggestions();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!artist.trim() || !youtubeUrl.trim()) {
      setError("Please enter both artist name and YouTube link.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artist, youtubeUrl }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit suggestion");
      }
      setArtist("");
      setYoutubeUrl("");
      setSuccess("Suggestion submitted!");
      fetchSuggestions();
    } catch (err: any) {
      setError(err.message || "Error submitting suggestion");
    } finally {
      setLoading(false);
    }
  }

  // Like logic
  function hasLiked(id: string) {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`liked_suggestion_${id}`) === '1';
  }
  function setLiked(id: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`liked_suggestion_${id}`, '1');
  }
  async function handleLike(id: string) {
    if (hasLiked(id)) return;
    try {
      await fetch('/api/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setLiked(id);
      fetchSuggestions();
    } catch {}
  }

  // Most voted (top 3 by likes)
  const mostVoted = [...suggestions].sort((a, b) => b.likes - a.likes).slice(0, 3);
  // The rest, sorted by date
  const rest = suggestions.filter(s => !mostVoted.some(mv => mv.id === s.id));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <span role="img" aria-label="music">🎵</span>
        Music Suggestions
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 w-full max-w-md">
        <input
          type="text"
          value={artist}
          onChange={e => setArtist(e.target.value)}
          placeholder="Artist name"
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
          required
        />
        <input
          type="url"
          value={youtubeUrl}
          onChange={e => setYoutubeUrl(e.target.value)}
          placeholder="YouTube link (https://...)"
          className="border rounded px-3 py-2 focus:outline-none focus:ring"
          required
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? "Submitting..." : "Suggest"}
        </button>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
      </form>
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Most Voted</h2>
        <ul className="space-y-2 mb-6">
          {mostVoted.length === 0 ? (
            <li className="text-muted-foreground text-center">No votes yet.</li>
          ) : (
            mostVoted.map((s) => (
              <li key={s.id} className="bg-background/80 border rounded px-4 py-2 shadow-sm flex flex-col gap-1">
                <div className="font-bold flex items-center gap-2">{s.artist}
                  <button
                    className={`ml-2 px-2 py-1 rounded ${hasLiked(s.id) ? 'bg-gray-300 text-gray-600' : 'bg-primary text-white hover:bg-primary/80'}`}
                    onClick={() => handleLike(s.id)}
                    disabled={hasLiked(s.id)}
                    title={hasLiked(s.id) ? 'You already liked this' : 'Like'}
                  >
                    👍 {s.likes}
                  </button>
                </div>
                <a href={s.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{s.youtubeUrl}</a>
                <div className="text-xs text-muted-foreground">Suggested at {new Date(s.createdAt).toLocaleString()}</div>
              </li>
            ))
          )}
        </ul>
        <h2 className="text-xl font-semibold mb-2">Public Suggestions</h2>
        {loading && <div className="text-muted-foreground">Loading suggestions...</div>}
        <ul className="space-y-2">
          {rest.length === 0 ? (
            <li className="text-muted-foreground text-center">No suggestions yet. Be the first!</li>
          ) : (
            rest.map((s) => (
              <li key={s.id} className="bg-background/80 border rounded px-4 py-2 shadow-sm flex flex-col gap-1">
                <div className="font-bold flex items-center gap-2">{s.artist}
                  <button
                    className={`ml-2 px-2 py-1 rounded ${hasLiked(s.id) ? 'bg-gray-300 text-gray-600' : 'bg-primary text-white hover:bg-primary/80'}`}
                    onClick={() => handleLike(s.id)}
                    disabled={hasLiked(s.id)}
                    title={hasLiked(s.id) ? 'You already liked this' : 'Like'}
                  >
                    👍 {s.likes}
                  </button>
                </div>
                <a href={s.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{s.youtubeUrl}</a>
                <div className="text-xs text-muted-foreground">Suggested at {new Date(s.createdAt).toLocaleString()}</div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
} 