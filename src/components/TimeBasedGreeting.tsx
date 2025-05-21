import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

const TimeBasedGreeting: React.FC<{ username?: string }> = ({ username }) => {
  const [greeting, setGreeting] = useState('');
  const [suggestedMood, setSuggestedMood] = useState('');
  const { isDark } = useThemeStore();

  useEffect(() => {
    const getCurrentTimeGreeting = () => {
      const hour = new Date().getHours();
      let greetingText = '';
      let mood = '';

      if (hour >= 5 && hour < 12) {
        greetingText = 'Good morning';
        mood = 'Energetic';
      } else if (hour >= 12 && hour < 17) {
        greetingText = 'Good afternoon';
        mood = 'Focused';
      } else if (hour >= 17 && hour < 21) {
        greetingText = 'Good evening';
        mood = 'Relaxed';
      } else {
        greetingText = 'Good night';
        mood = 'Sleepy';
      }

      setGreeting(greetingText);
      setSuggestedMood(mood);
    };

    getCurrentTimeGreeting();
    const interval = setInterval(getCurrentTimeGreeting, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h2 className="text-2xl font-bold">
        {greeting}, {username || 'music lover'}!
      </h2>
      <p className="mt-2">Perfect time for some {suggestedMood.toLowerCase()} music.</p>
    </div>
  );
};

export default TimeBasedGreeting;