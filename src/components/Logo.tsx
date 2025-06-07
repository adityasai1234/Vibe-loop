import React from 'react';


import { Music } from 'lucide-react';

import { useThemeStore } from '../store/themeStore';

export const Logo: React.FC = () => {
  const { isDark } = useThemeStore();

  return (

    <div className="flex items-center space-x-2 group">
      <div className="relative">
        {/* Animated outer ring */}
        <div className={`w-8 h-8 rounded-full border-2 ${
          isDark ? 'border-indigo-500' : 'border-indigo-600'
        } animate-spin-slow`} />
        
        {/* Inner circle with gradient */}
        <div className={`absolute inset-0.5 rounded-full ${
          isDark 
            ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' 
            : 'bg-gradient-to-br from-indigo-600 to-indigo-700'
        } flex items-center justify-center`}>
          {/* Music note */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform group-hover:scale-110 transition-transform duration-300"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
      </div>
      
      {/* Text with gradient */}
      <span className={`text-xl font-medium tracking-tight bg-gradient-to-r ${
        isDark 
          ? 'from-white to-gray-300' 
          : 'from-gray-900 to-gray-700'
      } bg-clip-text text-transparent group-hover:opacity-80 transition-opacity duration-300`}>

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

};


