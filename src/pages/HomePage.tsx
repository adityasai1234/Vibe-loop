import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/themeStore';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useThemeStore();

  return (
    <div className={`p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">Welcome to Vibe Loop</h1>
      <p className="text-lg mb-4">
        Hello, {user?.email}! Start exploring music that matches your mood.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add your content sections here */}
      </div>
    </div>
  );
};