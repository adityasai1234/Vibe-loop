import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Disc3, Heart, User, Search, Settings, Play } from 'lucide-react'; // Import icons for mobile nav
import { useThemeStore } from '../store/themeStore';
import { useAuth } from '../context/AuthContext';
import { MusicPlayerMobileModal } from './MusicPlayerMobileModal'; // Will create this next

export const BottomNav: React.FC = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuth(); // To conditionally show profile
  const location = useLocation();
  const [isMusicPlayerModalOpen, setIsMusicPlayerModalOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/profile', icon: User, label: 'Profile' }, // Profile will be handled by RequireAuth
  ];

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 block sm:hidden 
      ${
        isDark ? 'bg-gray-900 border-t border-gray-700' : 'bg-white border-t border-gray-200'
      } 
      shadow-lg py-2
    `}>
      <nav className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium 
              ${location.pathname === item.path 
                ? (isDark ? 'text-blue-400' : 'text-blue-600') 
                : (isDark ? 'text-gray-400 hover:text-white dark:hover:text-white' : 'text-gray-600 hover:text-gray-900 dark:hover:text-white')
              }
              transition-colors duration-200
            `}
          >
            <item.icon size={24} className="mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
        
        {/* Music Player Button - Opens Modal */}
        <button
          onClick={() => setIsMusicPlayerModalOpen(true)}
          className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium 
            ${isDark ? 'text-gray-400 hover:text-white dark:hover:text-white' : 'text-gray-600 hover:text-gray-900 dark:hover:text-white'}
            transition-colors duration-200
          `}
        >
          <Play size={24} className="mb-1" /> {/* Or a custom music icon */}
          <span>Player</span>
        </button>
      </nav>

      {/* Music Player Modal (for full controls) */}
      {isMusicPlayerModalOpen && (
        <MusicPlayerMobileModal 
          isOpen={isMusicPlayerModalOpen} 
          onClose={() => setIsMusicPlayerModalOpen(false)} 
        />
      )}
    </div>

  );
}; 