import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { BADGES, Badge, XP_TIERS } from './badges';
import { useBadgeStore } from '../store/badgeStore';
// Corrected import and usage:
import { useAuthContext } from '../context/AuthContext'; 

interface BadgeCabinetProps {
  isOpen: boolean;
  onClose: () => void;
}

const BadgeCabinet: React.FC<BadgeCabinetProps> = ({ isOpen, onClose }) => {
  // Corrected hook usage:
  const { currentUser: user } = useAuthContext(); // Assuming you need 'user' which is 'currentUser' in AuthContext
  // If you need the full userProfile, it would be: const { userProfile } = useAuthContext();
  
  const { xp, level, unlockedBadges, initializeBadges, isLoading } = useBadgeStore();
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);
  const [animationData, setAnimationData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (user?.uid) { // Use currentUser.uid (aliased as user.uid here)
      initializeBadges(user.uid);
    }
  }, [user?.uid, initializeBadges]);

  // Load Lottie animations
  useEffect(() => {
    const loadAnimations = async () => {
      const animations: { [key: string]: any } = {};
      
      for (const badge of BADGES) {
        try {
          const response = await fetch(badge.lottieUrl);
          if (response.ok) {
            animations[badge.id] = await response.json();
          }
        } catch (error) {
          console.warn(`Failed to load animation for badge ${badge.id}:`, error);
        }
      }
      
      setAnimationData(animations);
    };

    loadAnimations();
  }, []);

  const isUnlocked = (badgeId: string) => {
    return unlockedBadges.some(ub => ub.id === badgeId);
  };

  const getTierColor = (tier: string) => {
    return XP_TIERS[tier as keyof typeof XP_TIERS]?.color || '#CD7F32';
  };

  const handleBadgeClick = (badge: Badge) => {
    if (isUnlocked(badge.id) && animationData[badge.id]) {
      setNewlyUnlockedBadge(badge);
      setTimeout(() => setNewlyUnlockedBadge(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="fixed inset-4 md:inset-8 lg:inset-16 bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-xl rounded-2xl border border-white/20 z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Badge Cabinet</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getTierColor(level) }}
                  />
                  <span className="text-white font-medium">{level}</span>
                </div>
                <div className="text-white/80">
                  <span className="font-bold text-yellow-400">{xp}</span> XP
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(100%-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {BADGES.map((badge) => {
                const unlocked = isUnlocked(badge.id);
                
                return (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: unlocked ? 1.05 : 1 }}
                    whileTap={{ scale: unlocked ? 0.95 : 1 }}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      unlocked
                        ? 'bg-white/10 border-white/30 hover:bg-white/20'
                        : 'bg-black/20 border-white/10 grayscale'
                    }`}
                    onClick={() => handleBadgeClick(badge)}
                  >
                    {/* Badge Icon/Animation */}
                    <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                      {unlocked && animationData[badge.id] ? (
                        <Lottie
                          animationData={animationData[badge.id]}
                          loop={false}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="text-4xl">{badge.icon}</div>
                      )}
                    </div>
                    
                    {/* Badge Info */}
                    <div className="text-center">
                      <h3 className={`font-bold text-sm mb-1 ${
                        unlocked ? 'text-white' : 'text-white/50'
                      }`}>
                        {badge.name}
                      </h3>
                      <p className={`text-xs mb-2 ${
                        unlocked ? 'text-white/80' : 'text-white/40'
                      }`}>
                        {badge.description}
                      </p>
                      
                      {/* Tier Badge */}
                      <div 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: getTierColor(badge.tier),
                          color: badge.tier === 'Gold' ? '#000' : '#fff'
                        }}
                      >
                        {badge.tier}
                      </div>
                    </div>
                    
                    {/* Lock Overlay */}
                    {!unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                        <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Badge Unlock Animation */}
      <AnimatePresence>
        {newlyUnlockedBadge && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl shadow-2xl border-4 border-white"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{newlyUnlockedBadge.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Badge Unlocked!
                </h3>
                <p className="text-xl text-white/90">
                  {newlyUnlockedBadge.name}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Example of accessing user data if needed (adjust based on your actual needs)
// console.log(user?.displayName);
// console.log(userProfile?.username);

export default BadgeCabinet;
