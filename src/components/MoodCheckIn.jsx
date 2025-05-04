import { useState } from "react";
// Placeholder for animation imports (e.g., Framer Motion)

const moods = [
  { emoji: "😀", label: "Happy" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "😱", label: "Anxious" },
  { emoji: "😌", label: "Calm" },
  { emoji: "🥳", label: "Excited" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤔", label: "Thoughtful" },
];
const tags = ["anxious", "joyful", "numb", "focused", "grateful", "overwhelmed"];
export default function MoodCheckIn({ onSubmit }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (onSubmit) onSubmit({ mood: selectedMood, intensity, tags: selectedTags });
    }, 800); // Simulate animation/EP gain
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-100 relative overflow-hidden animate-fade-in">
      {/* Animated floating background blobs (placeholder) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200 rounded-full opacity-40 blur-2xl animate-blob" />
        <div className="absolute bottom-10 right-10 w-52 h-52 bg-pink-200 rounded-full opacity-30 blur-2xl animate-blob animation-delay-2000" />
      </div>
      <form className="relative z-10 bg-white rounded-3xl shadow-xl p-8 w-96 max-w-full flex flex-col gap-6 animate-slide-up" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center mb-2">How are you feeling today?</h2>
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          {moods.map((mood) => (
            <button
              key={mood.emoji}
              type="button"
              className={`text-3xl w-14 h-14 flex items-center justify-center rounded-full border-4 transition-all shadow-sm ${selectedMood === mood.emoji ? "border-blue-400 scale-110 bg-blue-50" : "border-transparent bg-gray-50"}`}
              onClick={() => setSelectedMood(mood.emoji)}
              aria-label={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
        <div>
          <label className="block font-semibold mb-1">Mood Intensity: <span className="text-blue-500">{intensity}</span></label>
          <input
            type="range"
            min="0"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-blue-400"
          />
        </div>
        <div>
          <p className="font-semibold mb-1">Tags (optional):</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-1 rounded-full border transition-all ${selectedTags.includes(tag) ? "bg-blue-200 border-blue-400" : "bg-gray-100 border-gray-300"}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={!selectedMood || submitting}
          className={`bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition mt-2 ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {submitting ? "Checking in..." : "Submit Check-In"}
        </button>
      </form>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        .animate-slide-up { animation: slideUp 0.7s; }
        .animate-blob { animation: blob 8s infinite ease-in-out alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes blob { 0% { transform: scale(1) translateY(0); } 100% { transform: scale(1.2) translateY(-20px); } }
      `}</style>
    </div>
  );
}
