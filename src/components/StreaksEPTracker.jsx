import { time } from "console";
import { maxHeaderSize } from "http";
import { useState } from "react";
import SpotifyLogin from "./SpotifyLogin";
import { SelectPositioner } from "@chakra-ui/react";
// Placeholder for confetti and animation imports

const levels = [
  { name: "Mindful Explorer", minEP: 0 },
  { name: "Mood Adventurer", minEP: 50 },
  { name: "Emotion Sage", minEP: 120 },
  { name: "Vibe Master", minEP: 250 }
];

export default function StreaksEPTracker() {
  const [ep, setEp] = useState(65); // Placeholder EP
  const [streak, setStreak] = useState(7); // Placeholder streak days
  const [showMilestone, setShowMilestone] = useState(false);

  const currentLevel = levels.reduce((acc, lvl) => (ep >= lvl.minEP ? lvl : acc), levels[0]);
  const nextLevel = levels.find((lvl) => lvl.minEP > ep) || levels[levels.length - 1];
  const progress = nextLevel ? ((ep - currentLevel.minEP) / (nextLevel.minEP - currentLevel.minEP)) * 100 : 100;

  // Simulate milestone unlock
  const handleGainEP = () => {
    setEp((prev) => {
      const newEp = prev + 10;
      if (levels.some((lvl) => lvl.minEP === newEp)) setShowMilestone(true);
      return newEp;
    });
    setTimeout(() => setShowMilestone(false), 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-xl flex flex-col gap-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-pulse">🔥</span>
          <span className="font-bold text-lg">{streak} Day Streak</span>
        </div>
        <button
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-blue-200 transition"
          onClick={handleGainEP}
        >
          +10 EP
        </button>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-blue-600">Current Level: {currentLevel.name}</span>
          <span className="text-gray-500 text-sm">{ep} EP</span>
        </div>
        <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-pink-400 transition-all"
            style={{ width: `${progress}%` }}
          />
          <span className="absolute right-2 top-0 text-xs text-gray-600">{nextLevel ? `${nextLevel.minEP} EP` : "Max"}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        {/* Placeholder for badges */}
        <span className="px-3 py-1 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold">Streak 5</span>
        <span className="px-3 py-1 rounded-full bg-pink-200 text-pink-800 text-xs font-semibold">EP 50+</span>
      </div>
      {showMilestone && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-slide-up">
            <span className="text-4xl">🎉</span>
            <p className="text-lg font-semibold text-pink-500">Milestone Unlocked!</p>
            {/* Placeholder for confetti animation */}
          </div>
        </div>
      )}
      <style>{`
        .animate-slide-up { animation: slideUp 0.7s; }
        .animate-fade-in { animation: fadeIn 0.7s; }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
if (typeof window!== "undefined") {
  window.StreaksEPTracker = StreaksEPTracker; 
}
 else {
  console.error("StreaksEPTracker is not defined");
}
time.console.log("StreaksEPTracker is defined");

