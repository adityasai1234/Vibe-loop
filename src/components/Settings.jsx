import { useState } from "react";
// Placeholder for animation imports (e.g., Framer Motion)

export default function Settings() {
  const [blobStyle, setBlobStyle] = useState("animated");
  const [sound, setSound] = useState(true);
  const [bgMusic, setBgMusic] = useState(false);
  const [reminder, setReminder] = useState("08:00");
  const [privacy, setPrivacy] = useState({ journal: true, sharing: false });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-100 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-96 max-w-full flex flex-col gap-6 animate-slide-up">
        <h2 className="text-2xl font-bold text-center mb-2">Settings & Personalization</h2>
        <div>
          <p className="font-semibold mb-1">Mood Blob Style</p>
          <div className="flex gap-2">
            {['minimal', 'emoji', 'animated'].map((style) => (
              <button
                key={style}
                className={`px-3 py-1 rounded-full border transition-all ${blobStyle === style ? "bg-blue-200 border-blue-400" : "bg-gray-100 border-gray-300"}`}
                onClick={() => setBlobStyle(style)}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={sound} onChange={() => setSound((v) => !v)} />
            Sound Effects
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={bgMusic} onChange={() => setBgMusic((v) => !v)} />
            Background Music
          </label>
        </div>
        <div className="mt-2">
          <p className="font-semibold mb-1">Reminder Time</p>
          <input
            type="time"
            className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <p className="font-semibold mb-1">Privacy Settings</p>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={privacy.journal} onChange={() => setPrivacy((p) => ({ ...p, journal: !p.journal }))} />
            Private Journaling
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={privacy.sharing} onChange={() => setPrivacy((p) => ({ ...p, sharing: !p.sharing }))} />
            Allow Sharing Mood Posters
          </label>
        </div>
        <button className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition mt-2">Save Settings</button>
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

