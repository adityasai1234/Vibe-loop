import React, { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useThemeStore } from '../store/themeStore';

const SleepTimer: React.FC = () => {
  const { pause } = usePlayerStore();
  const { isDark } = useThemeStore();
  const [timerActive, setTimerActive] = useState(false);
  const [selectedTime, setSelectedTime] = useState(15); // Default 15 minutes
  const [remainingTime, setRemainingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start the timer
  const startTimer = () => {
    // Convert minutes to seconds
    const seconds = selectedTime * 60;
    setRemainingTime(seconds);
    setTimerActive(true);
  };

  // Cancel the timer
  const cancelTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
    setRemainingTime(0);
  };

  // Handle timer countdown
  useEffect(() => {
    if (timerActive && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            // Time's up - pause playback and clear timer
            pause();
            cancelTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (remainingTime === 0 && timerActive) {
      cancelTimer();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, remainingTime, pause]);

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <h3 className="text-lg font-bold mb-3">Sleep Timer</h3>
      
      {!timerActive ? (
        <div>
          <div className="mb-3">
            <label htmlFor="timer-select" className="block text-sm mb-1">
              Stop playback after:
            </label>
            <select
              id="timer-select"
              value={selectedTime}
              onChange={(e) => setSelectedTime(Number(e.target.value))}
              className={`w-full p-2 rounded ${isDark ? 'bg-gray-700' : 'bg-white'} border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
            >
              <option value={5}>5 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
            </select>
          </div>
          <button
            onClick={startTimer}
            className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
          >
            Start Timer
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-3xl font-bold mb-3">
            {formatTime(remainingTime)}
          </div>
          <p className="text-sm mb-3">Music will stop playing after timer ends</p>
          <button
            onClick={cancelTimer}
            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Cancel Timer
          </button>
        </div>
      )}
    </div>
  );
};

export default SleepTimer;
