import React, { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiFillApple } from "react-icons/ai";

const moodThemes = [
  { color: "#6EC1E4", label: "Calm" },
  { color: "#F9A826", label: "Excited" },
  { color: "#F76E6C", label: "Passionate" },
  { color: "#A3E635", label: "Peaceful" },
];
const genres = ["Pop", "Rock", "Jazz", "Classical", "Hip-Hop", "EDM"];

const auth = getAuth();
const provider = new GoogleAuthProvider();

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [notificationTime, setNotificationTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleAuth = (e) => {
    e.preventDefault();
    setShowOnboarding(true);
  };

  const handleOAuth = (provider) => {
    setShowOnboarding(true);
  };

  const handleGoogleSignIn = () => {
    signInWithRedirect(auth, provider);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <AuthLayout
      title="Vibeloop"
      subtitle={isLogin ? "Welcome back!" : "Create your account"}
    >
        
        <form className="space-y-4" onSubmit={handleAuth}>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full h-12 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            className="h-12 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle size="20px" />
            <span className="text-sm text-gray-700 dark:text-gray-200">Google</span>
          </button>
          <button
            className="h-12 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            onClick={() => handleOAuth("apple")}
          >
            <AiFillApple size="20px" className="text-black dark:text-white" />
            <span className="text-sm text-gray-700 dark:text-gray-200">Apple</span>
          </button>
        </div>
        
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="ml-1 text-primary-500 dark:text-primary-400 hover:underline focus:outline-none"
            onClick={() => setIsLogin((v) => !v)}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg space-y-6 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">Welcome! 🎉</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Let's personalize your experience</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Choose your mood color theme:</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {moodThemes.map((theme) => (
                  <button
                    key={theme.color}
                    className={`w-12 h-12 rounded-full border-4 transition-all duration-300 hover:scale-105 ${selectedTheme === theme.color ? "border-primary-500 scale-110 shadow-md" : "border-transparent"}`}
                    style={{ background: theme.color }}
                    onClick={() => setSelectedTheme(theme.color)}
                    aria-label={`Select ${theme.label} theme`}
                  >
                    <span className="sr-only">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Select favorite music genres:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm ${selectedGenres.includes(genre) ? "bg-primary-100 border-primary-300 text-primary-700 dark:bg-primary-900 dark:border-primary-700 dark:text-primary-300" : "bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"} hover:shadow-sm`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Set daily check-in reminder:</p>
              <input
                type="time"
                className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
              />
            </div>
            
            <button
              className="w-full h-12 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
              onClick={() => setShowOnboarding(false)}
            >
              Complete Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}