import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/themeStore';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useThemeStore();

  return (
    <div className={`p-8 ${isDark ? 'text-white' : 'text-black'}`}>
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Email</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{user?.email}</p>
          </div>
          {/* Add more profile information here */}
        </div>
      </div>
    </div>
  );
};
