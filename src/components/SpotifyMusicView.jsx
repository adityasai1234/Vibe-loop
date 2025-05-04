import { useState } from "react";
// Placeholder for Spotify API integration

const mockTracks = [
  {
    id: "1",
    title: "Sunshine Vibes",
    artist: "Chill Beats",
    cover: "https://via.placeholder.com/80x80.png?text=🎵",
    preview: "#",
    mood: "Happy",
    anthem: true
  },
  {
    id: "2",
    title: "Blue Skies",
    artist: "Dreamer",
    cover: "https://via.placeholder.com/80x80.png?text=🎶",
    preview: "#",
    mood: "Calm",
    anthem: false
  },
  {
    id: "3",
    title: "Night Drive",
    artist: "Synthwave",
    cover: "https://via.placeholder.com/80x80.png?text=🌙",
    preview: "#",
    mood: "Thoughtful",
    anthem: false
  }
];

export default function SpotifyMusicView() {
export default function VibeRecsPage() {
  const [liked, setLiked] = useState({});
  const [playlist, setPlaylist] = useState([]);

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const togglePlaylist = (id) => {
    setPlaylist((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 animate-fade-in">
      <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl flex flex-col gap-6 animate-slide-up">
        <h2 className="text-2xl font-bold text-center mb-2">Spotify Recommendations</h2>
        {mockTracks.map((track, idx) => (
          <div
            key={track.id}
            className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition-all ${track.anthem ? "bg-blue-50 border-blue-300 scale-105" : "bg-gray-50 border-transparent"}`}
          >
            <img src={track.cover} alt={track.title} className="w-16 h-16 rounded-xl shadow" />
            <div className="flex-1">
              <div className="font-semibold text-lg flex items-center gap-2">
                {track.title}
                {track.anthem && <span className="ml-1 px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full text-xs animate-pulse">Today’s Anthem</span>}
              </div>
              <div className="text-gray-500 text-sm">{track.artist}</div>
              <div className="flex gap-2 mt-2">
                <button
                  className={`px-2 py-1 rounded-full border text-sm transition-all ${liked[track.id] ? "bg-pink-200 border-pink-400" : "bg-gray-100 border-gray-300"}`}
                  onClick={() => toggleLike(track.id)}
                  aria-label="Like"
                >
                  {liked[track.id] ? "❤️" : "🤍"}
                </button>
                <button
                  className={`px-2 py-1 rounded-full border text-sm transition-all ${playlist.includes(track.id) ? "bg-green-200 border-green-400" : "bg-gray-100 border-gray-300"}`}
                  onClick={() => togglePlaylist(track.id)}
                  aria-label="Add to Playlist"
                >
                  {playlist.includes(track.id) ? "Added to Mood Playlist" : "Add to Mood Playlist"}
                </button>
                <a
                  href={track.preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-full border bg-blue-100 border-blue-300 text-blue-700 text-sm hover:bg-blue-200 transition"
                >
                   Preview
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        .animate-slide-up { animation: slideUp 0.7s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

