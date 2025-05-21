import React from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useThemeStore } from '../store/themeStore';

interface PlaybackRateControlProps {
  className?: string;
  minimal?: boolean;
}

const PlaybackRateControl: React.FC<PlaybackRateControlProps> = ({ className = '', minimal = false }) => {
  const { playbackRate, setPlaybackRate } = usePlayerStore();
  const { isDark } = useThemeStore();
  
  const handleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!minimal && <span className="text-sm">Speed</span>}
      <select
        value={playbackRate}
        onChange={handleRateChange}
        className={`rounded ${minimal ? 'text-xs py-0.5' : 'text-sm py-1'} px-2 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
        aria-label="Playback speed"
      >
        {[0.5, 0.75, 1, 1.25, 1.5].map(rate => (
          <option key={rate} value={rate}>{rate}×</option>
        ))}
      </select>
    </div>
  );
};

export default PlaybackRateControl;
