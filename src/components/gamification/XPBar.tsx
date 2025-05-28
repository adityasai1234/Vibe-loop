import React from 'react';
import { useGamification } from '../../context/GamificationContext';
import { motion } from 'framer-motion';

// Assuming XP tiers are defined somewhere accessible, e.g., in gamification types or a config
// For this example, let's define a simple structure here or assume it's part of UserGamificationData or fetched.
// A more robust solution would fetch XP tier configuration or have it globally available.
const XP_PER_LEVEL = 100; // Example: 100 XP to level up

export const XPBar: React.FC = () => {
  const { gamificationData, loading } = useGamification();

  if (loading || !gamificationData) {
    // Skeleton loader for XP bar
    return (
      <div className="w-full bg-gray-700 rounded-full h-6 my-4 animate-pulse">
        <div className="bg-gray-600 h-6 rounded-full w-1/3"></div>
      </div>
    );
  }

  const { xp, level } = gamificationData;
  
  const currentLevelXpStart = (level - 1) * XP_PER_LEVEL;
  const nextLevelXpTarget = level * XP_PER_LEVEL;
  const xpIntoCurrentLevel = xp - currentLevelXpStart;
  const xpForNextLevel = nextLevelXpTarget - currentLevelXpStart;
  const progressPercentage = Math.min(100, Math.max(0, (xpIntoCurrentLevel / xpForNextLevel) * 100));

  return (
    <div className="my-4 p-3 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-1 px-1">
        <span className="text-sm font-medium text-blue-400">Level {level}</span>
        <span className="text-xs font-medium text-gray-300">
          {xp} XP / {nextLevelXpTarget} XP to Level {level + 1}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden border border-gray-600">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full shadow-md"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
      {progressPercentage === 100 && (
        <p className="text-xs text-center mt-2 text-green-400 animate-pulse">Level Up Soon!</p>
      )}
    </div>
  );
};