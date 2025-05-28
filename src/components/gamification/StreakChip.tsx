import React from 'react';
import { useGamification } from '../../context/GamificationContext';
import { motion } from 'framer-motion';

// Example: Icons for streak and multiplier
const StreakIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.755 12.03a1 1 0 00.385 1.45l.007.003c.274.152.606.167.901.049l6.755-12.03a1 1 0 00-.385-1.45zM12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.755 12.03a1 1 0 00.385 1.45l.007.003c.274.152.606.167.901.049l6.755-12.03a1 1 0 00-.385-1.45z" clipRule="evenodd" />
    <path d="M4.262 10.647a1 1 0 011.415-1.414l3.527 3.527a1 1 0 010 1.414l-3.527 3.527a1 1 0 01-1.415-1.414l2.82-2.82-2.82-2.82z" />
  </svg>
);

const MultiplierIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v1a1 1 0 001 1h12a1 1 0 001-1V6h1a1 1 0 100-2h-1V3a1 1 0 00-1-1H5zm10 2H5v1h10V4zM3 9a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm15 5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2zm-3 0v2h2v-2h-2zM8 14a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2zm-1 0v2h2v-2H7z" />
  </svg>
);

export const StreakChip: React.FC = () => {
  const { gamificationData, loading } = useGamification();

  if (loading || !gamificationData) {
    // Skeleton loader for streak chip
    return (
      <div className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-full shadow-md animate-pulse">
        <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
        <div className="h-4 bg-gray-600 rounded w-12"></div>
        <div className="w-px h-4 bg-gray-600"></div>
        <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
        <div className="h-4 bg-gray-600 rounded w-8"></div>
      </div>
    );
  }

  const { moodStreak, currentStreakMultiplier } = gamificationData;

  if (moodStreak === 0 && currentStreakMultiplier === 1) {
    return null; // Don't show if no streak and base multiplier
  }

  return (
    <motion.div 
      className="flex items-center space-x-2 bg-gray-800 bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-700"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {moodStreak > 0 && (
        <div className="flex items-center" title={`Current Mood Streak: ${moodStreak} days`}>
          <StreakIcon />
          <span className="text-sm font-medium text-orange-300">{moodStreak}-Day Streak</span>
        </div>
      )}
      {moodStreak > 0 && currentStreakMultiplier > 1 && (
        <div className="w-px h-4 bg-gray-600"></div> // Separator
      )}
      {currentStreakMultiplier > 1 && (
        <div className="flex items-center" title={`XP Multiplier: ${currentStreakMultiplier}x`}>
          <MultiplierIcon />
          <span className="text-sm font-medium text-purple-300">{currentStreakMultiplier}x XP</span>
        </div>
      )}
    </motion.div>
  );
};