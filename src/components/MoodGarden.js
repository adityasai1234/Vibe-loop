import React from "react";
// Placeholder for animation imports (e.g., Framer Motion, Lottie)

export default function CompanionPage() {
  // Placeholder state for garden evolution
  const moodLevel = 3; // Example: 1-5, affects garden visuals
  const streak = 7; // Example streak days

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-96 max-w-full flex flex-col gap-6 animate-slide-up items-center">
        <h2 className="text-2xl font-bold text-center mb-2">Mood Garden</h2>
        {/* Animated garden or pet placeholder */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Example: Plant or pet SVG changes with moodLevel and streak */}
          <svg width="180" height="180" viewBox="0 0 180 180">
            <ellipse cx="90" cy="160" rx="60" ry="18" fill="#A3E635" opacity="0.3" />
            <circle cx="90" cy="100" r="50" fill="#6EC1E4" />
            <ellipse cx="90" cy="120" rx="30" ry="12" fill="#F9A826" opacity="0.7" />
            {/* MoodLevel-based leaves */}
            {Array.from({ length: moodLevel }).map((_, i) => (
              <ellipse key={i} cx={90 + Math.sin((i / moodLevel) * Math.PI * 2) * 35} cy={100 - Math.cos((i / moodLevel) * Math.PI * 2) * 35} rx="12" ry="24" fill="#A3E635" opacity="0.8" />
            ))}
            {/* Streak effect: sun */}
            {streak >= 5 && <circle cx="40" cy="40" r="18" fill="#F9A826" opacity="0.7" />}
          </svg>
          {/* Placeholder for animated pet or weather effects */}
        </div>
        <div className="flex flex-col items-center gap-2 mt-4">
          <span className="text-lg font-semibold">Your garden is thriving!</span>
          <span className="text-green-600 font-bold">Streak: {streak} days</span>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 transition">Water</button>
          <button className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-pink-200 transition">Pet</button>
        </div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        .animate-slide-up { animation: slideUp 0.7s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}