import React, { useState } from "react";
// Placeholder for animation imports (e.g., Framer Motion)

const prompts = [
  "What triggered this?",
  "How did you cope?",
  "What are you grateful for?",
  "What did you learn today?"
];
export default function JournalPage({ onSave }) {
  const [entry, setEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setEntry((prev) => prev ? prev + "\n" + prompt + " " : prompt + " ");
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowSuccess(true);
      if (onSave) onSave(entry);
      setTimeout(() => setShowSuccess(false), 1200);
    }, 900); // Simulate save + animation
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-blue-100 relative animate-fade-in">
      <form className="bg-white rounded-3xl shadow-xl p-8 w-96 max-w-full flex flex-col gap-6 animate-slide-up relative z-10" onSubmit={handleSave}>
        <h2 className="text-2xl font-bold text-center mb-2">Journal Entry</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className={`px-3 py-1 rounded-full border transition-all text-sm ${selectedPrompt === prompt ? "bg-blue-200 border-blue-400" : "bg-gray-100 border-gray-300"}`}
              onClick={() => handlePrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="relative">
          <textarea
            className="w-full min-h-[120px] rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none transition-all"
            placeholder="Write your thoughts..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            required
          />
          <span className="absolute right-3 bottom-3 text-gray-400 cursor-pointer" title="Voice-to-text (coming soon)">🎤</span>
        </div>
        <button
          type="submit"
          disabled={!entry || saving}
          className={`bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition mt-2 ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {saving ? "Saving..." : "Save Entry"}
        </button>
      </form>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-slide-up">
            <span className="text-4xl">📝✨</span>
            <p className="text-lg font-semibold text-blue-500">Entry Saved! +5 EP</p>
          </div>
        </div>
      )}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.7s; }
        .animate-slide-up { animation: slideUp 0.7s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}