import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionStore } from '../store/sessionStore';

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
  userName?: string;
}

interface EmojiOverlayProps {
  containerRef?: React.RefObject<HTMLDivElement>;
}

const EmojiOverlay: React.FC<EmojiOverlayProps> = ({ containerRef }) => {
  const { emojiReactions } = useSessionStore();
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    // Listen for new emoji reactions
    if (emojiReactions.length > 0) {
      const latestEmoji = emojiReactions[emojiReactions.length - 1];
      
      // Generate random position for the emoji
      const containerRect = containerRef?.current?.getBoundingClientRect();
      const x = Math.random() * (containerRect?.width || 300);
      const y = Math.random() * (containerRect?.height || 200) + (containerRect?.height || 200) * 0.5;
      
      const newFloatingEmoji: FloatingEmoji = {
        id: `${latestEmoji.id}-${Date.now()}`,
        emoji: latestEmoji.emoji,
        x,
        y,
        userName: latestEmoji.userName
      };
      
      setFloatingEmojis(prev => [...prev, newFloatingEmoji]);
      
      // Remove emoji after animation completes
      setTimeout(() => {
        setFloatingEmojis(prev => prev.filter(e => e.id !== newFloatingEmoji.id));
      }, 3000);
    }
  }, [emojiReactions, containerRef]);

  const emojiVariants = {
    initial: {
      opacity: 0,
      scale: 0.5,
      y: 0,
      rotate: 0
    },
    animate: {
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1.2, 1, 0.8],
      y: -150,
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 3,
        ease: "easeOut",
        times: [0, 0.1, 0.8, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {floatingEmojis.map((floatingEmoji) => (
          <motion.div
            key={floatingEmoji.id}
            className="absolute pointer-events-none"
            style={{
              left: floatingEmoji.x,
              top: floatingEmoji.y,
              zIndex: 50
            }}
            variants={emojiVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="relative">
              {/* Main Emoji */}
              <motion.div
                className="text-4xl filter drop-shadow-lg"
                variants={pulseVariants}
                animate="animate"
              >
                {floatingEmoji.emoji}
              </motion.div>
              
              {/* Sparkle Effect */}
              <motion.div
                className="absolute inset-0 text-4xl"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.3, 1.5]
                }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: "easeOut"
                }}
              >
                ✨
              </motion.div>
              
              {/* User Name (optional) */}
              {floatingEmoji.userName && (
                <motion.div
                  className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {floatingEmoji.userName}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Background Particle Effect */}
      <AnimatePresence>
        {floatingEmojis.length > 0 && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
          >
            {/* Animated background particles */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [-20, -40, -60],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiOverlay;