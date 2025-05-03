import React, { useState } from "react";
// Placeholder for animation imports (e.g., Framer Motion)

const mockTimeline = [
  { id: 1, date: "2024-06-01", mood: "😀", intensity: 8, tags: ["joyful"], journal: "Had a great day!", music: "Sunshine Vibes", streak: true },
  { id: 2, date: "2024-06-02", mood: "😢", intensity: 3, tags: ["numb"], journal: "Felt a bit down.", music: "Blue Skies", streak: true },
  { id: 3, date: "2024-06-03", mood: "😌", intensity: 6, tags: ["grateful"], journal: "Relaxed and grateful.", music: "Night Drive", streak: true },
  { id: 4, date: "2024-06-04", mood: "😡", intensity: 7, tags: ["overwhelmed"], journal: "Stressful workday.", music: "Energy Boost", streak: false },
];

const tagColors = {
  joyful: "bg-yellow-200",
  numb: "bg-gray-200",
  grateful: "bg-green-200",
  overwhelmed: "bg-red-200"
};

-export default function MoodTimeline() {
+export default function MoodLoopPage() {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("");

  const filteredTimeline = filter
    ? mockTimeline.filter((item) => item.tags.includes(filter))
    : mockTimeline;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-pink-100 animate-fade-in">
      <div className="w-full max-w-2xl p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-2">Mood Timeline</h2>
        <div className="flex gap-2 justify-center mb-4">
          {Object.keys(tagColors).map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full border text-sm transition-all ${filter === tag ? "bg-blue-200 border-blue-400" : `${tagColors[tag]} border-gray-300`}`}
              onClick={() => setFilter(filter === tag ? "" : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {filteredTimeline.map((item) => (
            <div
              key={item.id}
              className={`relative flex items-center gap-4 p-4 rounded-3xl shadow-md border transition-all cursor-pointer ${expanded === item.id ? "bg-blue-50 border-blue-300 scale-105" : "bg-white border-transparent"}`}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <div
                className={`flex items-center justify-center rounded-full shadow text-3xl transition-all mr-2 ${expanded === item.id ? "w-20 h-20" : "w-14 h-14"}`}
                style={{ background: `rgba(59,130,246,${item.intensity/12})` }}
              >
                {item.mood}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">{item.date}</div>
                <div className="flex gap-2 mt-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className={`px-2 py-0.5 rounded-full text-xs ${tagColors[tag]}`}>{tag}</span>
                  ))}
                </div>
                {expanded === item.id && (
                  <div className="mt-3 animate-fade-in">
                    <div className="mb-1"><span className="font-semibold">Journal:</span> {item.journal}</div>
                    <div className="mb-1"><span className="font-semibold">Music:</span> {item.music}</div>
                    <div className="mb-1"><span className="font-semibold">Intensity:</span> {item.intensity}</div>
                    <div className="flex items-center gap-2 mt-2">
                      {item.streak && <span className="text-orange-500 text-xl animate-pulse">🔥</span>}
                      <span className="text-xs text-gray-400">{item.streak ? "Streak Day" : "No Streak"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}