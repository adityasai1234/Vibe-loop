import React, { useState } from 'react';
import { Nfc, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

interface MoodPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMoodSelect: (mood: string) => void;
}

// Mood data with emojis, mood names, genres, and example tracks
const moodData = [
  {
    emoji: '😀',
    mood: 'Happy',
    genres: ['Pop', 'Funk', 'Dance'],
    examples: ['Electric Dreams', 'Sunshine Pop']
  },
  {
    emoji: '😢',
    mood: 'Sad',
    genres: ['Lo-fi', 'Acoustic', 'Piano'],
    examples: ['Ocean Breeze', 'Rainy Days']
  },
  {
    emoji: '😡',
    mood: 'Angry',
    genres: ['Rock', 'Metal', 'Rap'],
    examples: ['Bohemian Rhapsody', 'Break Free', 'Urban Rage']
  },
  {
    emoji: '😌',
    mood: 'Calm',
    genres: ['Ambient', 'Chill', 'Soft Lo-fi'],
    examples: ['Crystal Skies', 'Serenity']
  },
  {
    emoji: '💪',
    mood: 'Motivated',
    genres: ['EDM', 'Trap', 'Power Pop'],
    examples: ['Midnight Drive', 'Uplifted']
  },
  {
    emoji: '😍',
    mood: 'Romantic',
    genres: ['R&B', 'Acoustic Pop', 'Love Ballads'],
    examples: ['Slow Motion', 'Heartbeat']
  },
  {
    emoji: '🤩',
    mood: 'Hyped',
    genres: ['EDM', 'Festival Beats', 'Hyperpop'],
    examples: ['Urban Rhythm', 'Ignite']
  },
  {
    emoji: '🌙',
    mood: 'Reflective',
    genres: ['Chillstep', 'Jazzhop', 'Nightcore'],
    examples: ['Late Night Drive', 'Lunar Loop']
  },
  {
    emoji: '😴',
    mood: 'Sleepy',
    genres: ['Ambient', 'Classical', 'Chill'],
    examples: ['Dreamscape', 'Lullaby']
  },
  {
    emoji: '🥳',
    mood: 'Party',
    genres: ['Dance', 'Hip Hop', 'Electronic'],
    examples: ['Club Anthem', 'Party Starter']
  },
  {
    emoji: '😌',
    mood: 'Chill',
    genres: ['Chill', 'Lo-fi', 'Jazz'],
    examples: ['Sunset Vibes', 'Chill Wave']
  },
  {
    emoji: '🧠',
    mood: 'Focus',
    genres: ['Instrumental', 'Electronic', 'Classical'],
    examples: ['Deep Focus', 'Concentration']
  }
];

export const MoodPanel: React.FC<MoodPanelProps> = ({ isOpen, onClose, onMoodSelect }) => {
  const { isDark } = useThemeStore();
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const handleMoodClick = (mood: string) => {
    onMoodSelect(mood);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, type: 'spring', bounce: 0.25 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl z-50 p-6 ${isDark ? 'bg-gray-900/95 text-white' : 'bg-white/95 text-gray-900'} backdrop-blur-md border ${isDark ? 'border-white/10' : 'border-gray-200'}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                What's your vibe today? 🌈
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {moodData.map((item) => (
                <motion.button
                  key={item.mood}
                  onClick={() => handleMoodClick(item.mood)}
                  onMouseEnter={() => setHoveredMood(item.mood)}
                  onMouseLeave={() => setHoveredMood(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300
                    ${isDark ? 'bg-gray-800/70 hover:bg-gray-700/70' : 'bg-white hover:bg-gray-100'}
                    shadow-md hover:shadow-lg border ${isDark ? 'border-white/5' : 'border-gray-200'}
                  `}
                >
                  <motion.span 
                    className="text-5xl mb-3"
                    animate={hoveredMood === item.mood ? { y: [0, -10, 0] } : {}}
                    transition={{ duration: 0.5, repeat: 0 }}
                    role="img" 
                    aria-label={item.mood}
                  >
                    {item.emoji}
                  </motion.span>
                  <span className="font-medium text-lg">{item.mood}</span>
                  <span className="text-xs mt-1 text-center opacity-70">
                    {item.genres.join(', ')}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className={`mt-6 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'} text-center text-sm opacity-70`}>
              Select a mood to personalize your music experience
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MoodPanel;