import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDailyCard } from './useDailyCard';

interface SurpriseCardProps {
  className?: string;
}

const SurpriseCard: React.FC<SurpriseCardProps> = ({ className = '' }) => {
  const { card, isLoading, hasOpened, error, openCard } = useDailyCard();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleCardClick = async () => {
    if (hasOpened || isFlipping || !card) return;
    
    setIsFlipping(true);
    setIsFlipped(true);
    
    // Wait for flip animation to complete before marking as opened
    setTimeout(async () => {
      await openCard();
      setIsFlipping(false);
    }, 600);
  };

  const getCardIcon = () => {
    if (!card) return '🎁';
    
    switch (card.type) {
      case 'tip': return '💡';
      case 'lyric': return '🎵';
      case 'quiz': return '🧩';
      default: return '🎁';
    }
  };

  const getCardTitle = () => {
    if (!card) return 'Daily Surprise';
    
    switch (card.type) {
      case 'tip': return 'Daily Tip';
      case 'lyric': return 'Music Quote';
      case 'quiz': return 'Music Quiz';
      default: return 'Daily Surprise';
    }
  };

  if (isLoading) {
    return (
      <div className={`w-full max-w-sm mx-auto ${className}`}>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full max-w-sm mx-auto ${className}`}>
        <div className="bg-red-500 rounded-2xl p-6 shadow-xl text-white text-center">
          <div className="text-4xl mb-4">😔</div>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return null;
  }

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      <div className="perspective-1000">
        <motion.div
          className="relative w-full h-64 preserve-3d cursor-pointer"
          style={{
            transformStyle: 'preserve-3d'
          }}
          animate={{
            rotateY: isFlipped ? 180 : 0
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut'
          }}
          onClick={handleCardClick}
          whileHover={!hasOpened && !isFlipping ? { scale: 1.02 } : {}}
          whileTap={!hasOpened && !isFlipping ? { scale: 0.98 } : {}}
        >
          {/* Front of card */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 shadow-xl"
            style={{
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="p-6 h-full flex flex-col items-center justify-center text-white text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
                className="text-6xl mb-4"
              >
                🎁
              </motion.div>
              
              <h3 className="text-xl font-bold mb-2">Daily Surprise</h3>
              <p className="text-white/80 text-sm mb-4">
                Tap to reveal today's surprise!
              </p>
              
              {!hasOpened && (
                <div className="flex items-center gap-2 text-yellow-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-medium">+20 XP</span>
                </div>
              )}
            </div>
          </div>

          {/* Back of card */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 shadow-xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="p-6 h-full flex flex-col text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{getCardIcon()}</div>
                <h3 className="text-lg font-bold">{getCardTitle()}</h3>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <p className="text-center text-sm leading-relaxed">
                  {card.text}
                </p>
              </div>
              
              {card.mediaUrl && (
                <div className="mt-4">
                  <img 
                    src={card.mediaUrl} 
                    alt="Daily card media" 
                    className="w-full h-20 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                  <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Opened!</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {hasOpened && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Come back tomorrow for another surprise! 🌟
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SurpriseCard;

// Add these CSS classes to your global CSS file (index.css)
/*
.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}
*/