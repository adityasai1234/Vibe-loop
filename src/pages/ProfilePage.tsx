import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/themeStore';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useThemeStore();

  return (
    <div className={`p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Email</h2>
            <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
          </div>
          {/* Add more profile information here */}
        </div>
      </div>
    </div>
  );
};