import React from 'react';
import { MoodJournal } from '../components/MoodJournal';
import { MoodInsights } from '../components/MoodInsights';
import { useThemeStore } from '../store/themeStore';

export const MoodJournalPage: React.FC = () => {
  const { isDark } = useThemeStore();
  // In a real app, you would get the current user ID from an auth context
  const mockUserId = 'user123'; // This is a placeholder
  
  return (
    <div className={`pt-16 md:pl-60 pb-20 min-h-screen w-full transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Your Emotional Soundtrack
        </h1>
        <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Track your daily moods alongside the music you listen to. Over time, this creates a personalized
          emotional soundtrack of your life and provides insights into how music affects your wellbeing.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoodJournal userId={mockUserId} />
          <MoodInsights userId={mockUserId} />
        </div>
      </div>
    </div>
  );
};