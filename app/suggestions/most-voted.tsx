import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface Suggestion {
  id: string;
  artist: string;
  youtubeUrl: string;
  createdAt: string;
  likes: number;
}

export default function MostVotedPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSuggestions() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/suggestions");
        if (!res.ok) throw new Error("Failed to fetch suggestions");
        const data = await res.json();
        // Only show suggestions with at least 1 like, sorted descending
        setSuggestions((data.suggestions || []).filter((s: Suggestion) => s.likes > 0).sort((a: Suggestion, b: Suggestion) => b.likes - a.likes));
      } catch (err: any) {
        setError(err.message || "Error fetching suggestions");
      } finally {
        setLoading(false);
      }
    }
    fetchSuggestions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="trophy">🏆</span>
        Most Voted Suggestions
      </h1>
      <div className="w-full max-w-md">
        {loading && <div className="text-muted-foreground">Loading suggestions...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <ul className="space-y-2">
          {suggestions.length === 0 ? (
            <li className="text-muted-foreground text-center">No votes yet.</li>
          ) : (
            suggestions.map((s) => (
              <li key={s.id} className="bg-background/80 border rounded px-4 py-2 shadow-sm flex flex-col gap-1">
                <div className="font-bold flex items-center gap-2">{s.artist}
                  <span className="ml-2 px-2 py-1 rounded bg-yellow-200 text-yellow-800">👍 {s.likes}</span>
                  <a href={s.youtubeUrl} target="_blank" rel="noopener noreferrer" title="Open YouTube link" className="ml-2 text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <ExternalLink className="h-4 w-4" />
                  </a>
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