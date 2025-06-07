import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Music, User, Heart } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const Sidebar: React.FC = () => {
  const { isDark } = useThemeStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/discover', icon: Music, label: 'Discover' },
    { path: '/mood', icon: Heart, label: 'Mood' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className={`fixed left-0 top-16 bottom-0 w-64 border-r ${
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(path)
                    ? isDark
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};