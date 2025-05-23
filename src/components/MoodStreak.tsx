import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { firestoreService } from '../services/firestoreService';
import { useThemeStore } from '../store/themeStore';

const MoodStreak: React.FC = () => {
  const [streakCount, setStreakCount] = useState(0);
  const { isDark } = useThemeStore();
  const auth = getAuth();

  useEffect(() => {
    const calculateStreak = async () => {
      if (!auth.currentUser) return;
      
      try {
        const entries = await firestoreService.getUserJournalEntries(auth.currentUser.uid);
        
        // Sort entries by timestamp in descending order
        const sortedEntries = entries.sort((a, b) => b.timestamp - a.timestamp);
        
        let streak = 0;
        let currentDate = new Date();
        
        // Set to beginning of the day
        currentDate.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < sortedEntries.length; i++) {
          const entryDate = new Date(sortedEntries[i].timestamp);
          entryDate.setHours(0, 0, 0, 0);
          
          // Check if this entry is from the expected date
          const expectedDate = new Date(currentDate);
          expectedDate.setDate(currentDate.getDate() - streak);
          
          if (entryDate.getTime() === expectedDate.getTime()) {
            streak++;
          } else {
            break;
          }
        }
        
        setStreakCount(streak);
      } catch (error) {
        console.error('Error calculating mood streak:', error);
      }
    };

    calculateStreak();
  }, [auth.currentUser]);

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} flex items-center`}>
      <div className="mr-3 text-2xl">🔥</div>
      <div>
        <h3 className="font-bold">Mood Streak</h3>
        <p>{streakCount} {streakCount === 1 ? 'day' : 'days'} in a row</p>
      </div>
    </div>
  );
};

export default MoodStreak;
