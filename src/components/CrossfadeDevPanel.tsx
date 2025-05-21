import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';

/**
 * Development panel for visualizing crossfade between tracks
 * Shows gain values for current and next track during transitions
 */
export default function CrossfadeDevPanel() {
  const { crossfadeSec } = usePlayerStore();
  const [currentGain, setCurrentGain] = useState(1);
  const [nextGain, setNextGain] = useState(0);
  const [isFading, setIsFading] = useState(false);
  
  // This is a mock implementation for visualization purposes
  // In a real implementation, you would read actual gain values from AudioEngine
  useEffect(() => {
    const audioEngine = (window as any).audioEngine;
    if (!audioEngine) return;
    
    // Set up polling to read gain values
    const interval = setInterval(() => {
      if (audioEngine.gainCurr && audioEngine.gainNext) {
        setCurrentGain(audioEngine.gainCurr.gain.value);
        setNextGain(audioEngine.gainNext.gain.value);
        setIsFading(nextGain > 0);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [nextGain]);
  
  if (!isFading && nextGain === 0) return null;
  
  return (
    <div className="fixed bottom-24 right-4 bg-black/80 text-white p-3 rounded-lg shadow-lg z-50 w-64">
      <h3 className="text-sm font-semibold mb-2">Crossfade Monitor ({crossfadeSec}s)</h3>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Current Track</span>
            <span>{Math.round(currentGain * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100" 
              style={{ width: `${currentGain * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Next Track</span>
            <span>{Math.round(nextGain * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-100" 
              style={{ width: `${nextGain * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}