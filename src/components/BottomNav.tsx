import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, User } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { isDark } = useThemeStore();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/discover', icon: Compass, label: 'Discover' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 sm:hidden ${
      isDark ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'
    }`}>
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive(path)
                ? isDark
                  ? 'text-white'
                  : 'text-gray-900'
                : isDark
                ? 'text-gray-400'
                : 'text-gray-500'
            }`}
          >
            <Icon size={20} className={isActive(path) ? 'text-primary-500' : ''} />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}; 