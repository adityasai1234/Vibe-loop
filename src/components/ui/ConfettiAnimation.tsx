import React from 'react';
import { motion } from 'framer-motion';

interface ConfettiPieceProps {
  x: number;
  y: number;
  rotation: number;
  color: string;
  delay: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ x, y, rotation, color, delay }) => {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: '8px',
        height: '16px',
        backgroundColor: color,
        rotate: rotation,
        borderRadius: '2px',
      }}
      initial={{ opacity: 0, y: -20, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [y, y + 100, y + 150],
        x: [x, x + Math.random() * 40 - 20, x + Math.random() * 60 - 30],
        rotate: rotation + (Math.random() * 360 - 180),
        scale: [0.5, 1, 1, 0.5],
      }}
      transition={{
        duration: 2 + Math.random() * 1.5,
        ease: 'easeOut',
        delay: delay,
        opacity: { times: [0, 0.1, 0.9, 1], duration: 2 + Math.random() * 1.5 },
        y: { type: 'spring', stiffness: 50, damping: 10 },
      }}
    />
  );
};

interface ConfettiAnimationProps {
  isActive: boolean;
  count?: number;
  originX?: number; // 0-100 (percentage from left)
  originY?: number; // 0-100 (percentage from top)
}

const COLORS = ['#FFC700', '#FF3D77', '#00C4FF', '#7B61FF', '#00E096'];

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ isActive, count = 50, originX = 50, originY = 50 }) => {
  if (!isActive) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {Array.from({ length: count }).map((_, index) => (
        <ConfettiPiece
          key={index}
          x={originX + (Math.random() - 0.5) * 30} // Spread around origin
          y={originY + (Math.random() - 0.5) * 20} // Spread around origin
          rotation={Math.random() * 360}
          color={COLORS[Math.floor(Math.random() * COLORS.length)]}
          delay={Math.random() * 0.5} // Stagger the start
        />
      ))}
    </div>
  );
};