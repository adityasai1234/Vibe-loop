import React, { useState } from "react";
// Placeholder for Firebase Auth imports and OAuth logic
// import { auth } from "../backend/firebaseConfig";

const moodThemes = [
  { color: "#6EC1E4", label: "Calm" },
  { color: "#F9A826", label: "Excited" },
  { color: "#F76E6C", label: "Passionate" },
  { color: "#A3E635", label: "Peaceful" },
];
const genres = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "EDM"];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [notificationTime, setNotificationTime] = useState("");

  // Placeholder handlers for auth
  const handleAuth = (e) => {
    e.preventDefault();
    setShowOnboarding(true);
  };
  const handleOAuth = (provider) => {
    setShowOnboarding(true);
  };
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-pink-100 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-80 max-w-full flex flex-col gap-6 animate-slide-up">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">Vibeloop</h1>
        <form className="flex flex-col gap-4" onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div className="flex flex-col gap-2">
          <button
            className="bg-gray-100 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-200 transition"
            onClick={() => handleOAuth("google")}
          >
            <span role="img" aria-label="Google">🔵</span> Continue with Google
          </button>
          <button
            className="bg-gray-100 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-200 transition"
            onClick={() => handleOAuth("apple")}
          >
            <span role="img" aria-label="Apple">🍏</span> Continue with Apple
          </button>
        </div>
        <p className="text-center text-gray-500 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="ml-1 text-blue-500 underline"
            onClick={() => setIsLogin((v) => !v)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-96 max-w-full flex flex-col gap-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-center mb-2">Welcome! 🎉</h2>
            <div>
              <p className="font-semibold mb-1">Choose your mood color theme:</p>
              <div className="flex gap-3 justify-center">
                {moodThemes.map((theme) => (
                  <button
                    key={theme.color}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${selectedTheme === theme.color ? "border-blue-500 scale-110" : "border-transparent"}`}
                    style={{ background: theme.color }}
                    onClick={() => setSelectedTheme(theme.color)}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">Select favorite music genres:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className={`px-3 py-1 rounded-full border transition-all ${selectedGenres.includes(genre) ? "bg-blue-200 border-blue-400" : "bg-gray-100 border-gray-300"}`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold mb-1">Set notification time:</p>
              <input
                type="time"
                className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 transition mt-2"
              onClick={() => setShowOnboarding(false)}
            >
              Finish Onboarding
            </button>
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