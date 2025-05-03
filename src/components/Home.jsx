import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const moodGradients = {
  happy: "bg-gradient-to-r from-[#FFD166] to-[#FFE29F]",
  calm: "bg-gradient-to-r from-[#A1C4FD] to-[#C2E9FB]",
  gloomy: "bg-gradient-to-r from-[#D4A5A5] to-[#8E9AAF]",
  excited: "bg-gradient-to-r from-[#FF9A9E] to-[#FAD0C4]",
};

function AnimatedBlob() {
  return (
    <motion.div
      className="absolute w-72 h-72 left-1/2 top-0 -translate-x-1/2 blur-2xl opacity-60 z-0"
      animate={{ scale: [1, 1.1, 1], rotate: [0, 15, -15, 0] }}
      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      style={{ background: "linear-gradient(135deg, #A1C4FD 0%, #FFD166 100%)", borderRadius: "50%" }}
    />
  );
}

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-4 pt-16 pb-8">
      <AnimatedBlob />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <img src="/welcome/logo-light.svg" alt="Vibeloop Logo" className="w-20 h-20 mb-2 drop-shadow-lg" />
        <h1 className="font-poppins text-4xl md:text-5xl font-bold text-gray-900 mb-2">Welcome to Vibeloop</h1>
        <motion.p
          className="font-quicksand text-lg md:text-xl text-gray-700 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Your daily ritual for feeling, reflecting, and vibing.
        </motion.p>
        <div className="flex gap-4 mt-2">
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FFE29F] text-gray-900 font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            >
              Sign Up
            </motion.button>
          </Link>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-full border-2 border-[#FFD166] text-[#FFD166] bg-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-all"
            >
              Log In
            </motion.button>
          </Link>
          <Link to="/demo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 rounded-full border-2 border-gray-200 text-gray-500 bg-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              Try Demo
            </motion.button>
          </Link>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <motion.img
            src="https://assets2.lottiefiles.com/packages/lf20_8wREpI.json"
            alt="Blob character journaling"
            className="w-40 h-40 object-contain mb-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{ borderRadius: "50%", background: "rgba(255,255,255,0.5)", boxShadow: "0 4px 32px #FFD16633" }}
          />
          <div className="flex gap-2 mt-2">
            <motion.span
              className="text-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            >🎵</motion.span>
            <motion.span
              className="text-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
            >😊</motion.span>
            <motion.span
              className="text-2xl"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
            >💭</motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #0002" }}
      className={`rounded-3xl p-6 min-w-[220px] max-w-xs bg-white/30 backdrop-blur-md shadow-lg border border-white/40 ${gradient}`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-poppins text-xl font-semibold mb-1">{title}</h3>
      <p className="font-quicksand text-gray-700 text-sm">{desc}</p>
    </motion.div>
  );
}

function Features() {
  return (
    <section className="flex flex-col items-center py-8 px-4 bg-transparent">
      <div className="flex flex-row gap-6 overflow-x-auto w-full justify-center pb-4">
        <FeatureCard
          icon="😀"
          title="Mood Picker"
          desc="Choose your vibe with expressive emojis."
          gradient={moodGradients.happy}
        />
        <FeatureCard
          icon={<span className="inline-block align-middle"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#1DB954"/><path d="M8 15c1.333-1 6-1 8 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M9 11c1.333-.667 4-.667 6 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg></span>}
          title="Spotify Preview"
          desc="Listen to tracks that match your mood."
          gradient={moodGradients.calm}
        />
        <FeatureCard
          icon="🌱"
          title="Mood Plant"
          desc="Grow your mood plant with daily streaks."
          gradient={moodGradients.excited}
        />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center py-6 px-4 text-gray-500 bg-white/60 backdrop-blur-md rounded-t-3xl mt-8">
      <p className="font-quicksand text-sm">© {new Date().getFullYear()} Vibeloop. Your mood, music, and journaling sanctuary.</p>
      <div className="flex gap-3 mt-2">
        <a href="https://github.com/" className="hover:text-[#FFD166] transition-colors" aria-label="GitHub"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.34-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.338 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.421-.012 2.751 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg></a>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-[#A1C4FD] via-[#FFD166] to-[#FF9A9E] relative overflow-x-hidden font-quicksand">
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}