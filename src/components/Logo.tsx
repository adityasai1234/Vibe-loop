import React from 'react';
import { Music } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const Logo: React.FC = () => {
  const { isDark } = useThemeStore();

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Music 
          size={32} 
          className="animate-bounce-slow"
          style={{ 
            animation: 'bounce 2s infinite',
            animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)'
          }}
        />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse-slow" />
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
        VibeLoop
      </span>
    </div>
  );
};


