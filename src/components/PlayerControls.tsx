import React from 'react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useThemeStore } from '../store/themeStore';
import { Timer, X, Settings, Volume2 } from 'lucide-react';

export const PlayerControls: React.FC = () => {
  const { sleepTimer, crossfade } = useMusicPlayer();
  const { isDark } = useThemeStore();
  const [showControls, setShowControls] = React.useState(false);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className={`p-2 rounded-full transition-colors ${
          isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
        }`}
        title="Player Settings"
      >
        <Settings size={20} />
      </button>

      {/* Controls Panel */}
      {showControls && (
        <div className={`absolute bottom-full right-0 mb-2 p-4 rounded-lg shadow-lg w-64 ${
          isDark ? 'bg-secondary-900' : 'bg-white'
        }`}>
          {/* Sleep Timer Section */}
          <div className="mb-4">
            <h3 className={`text-sm font-medium mb-2 text-secondary-700 dark:text-secondary-200`}>
              Sleep Timer
            </h3>
            
            {sleepTimer.isActive ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Timer size={16} className={isDark ? 'text-primary-400' : 'text-primary-600'} />
                  <span className={`text-sm text-secondary-600 dark:text-secondary-300`}>
                    {formatTime(sleepTimer.remainingTime)}
                  </span>
                </div>
                <button
                  onClick={sleepTimer.cancel}
                  className={`p-1 rounded-full ${
                    isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
                  }`}
                  title="Cancel Timer"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {sleepTimer.presets.map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => sleepTimer.start(minutes)}
                    className={`px-2 py-1 text-sm rounded ${
                      isDark 
                        ? 'bg-secondary-800 hover:bg-secondary-700 text-secondary-200' 
                        : 'bg-secondary-100 hover:bg-secondary-200 text-secondary-700'
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Crossfade Section */}
          <div>
            <h3 className={`text-sm font-medium mb-2 text-secondary-700 dark:text-secondary-200`}>
              Crossfade
            </h3>
            
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm text-secondary-600 dark:text-secondary-300`}>
                {crossfade.isEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={crossfade.toggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  crossfade.isEnabled
                    ? isDark ? 'bg-primary-600' : 'bg-primary-500'
                    : isDark ? 'bg-secondary-700' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    crossfade.isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {crossfade.isEnabled && (
              <div className="flex items-center space-x-2">
                <Volume2 size={16} className={isDark ? 'text-secondary-400' : 'text-secondary-500'} />
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={crossfade.duration}
                  onChange={(e) => crossfade.setDuration(parseFloat(e.target.value))}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                    isDark ? 'bg-secondary-700' : 'bg-secondary-200'
                  }`}
                  style={{
                    background: `linear-gradient(to right, ${
                      isDark ? '#3b82f6' : '#2563eb'
                    } 0%, ${
                      isDark ? '#3b82f6' : '#2563eb'
                    } ${(crossfade.duration / 10) * 100}%, ${
                      isDark ? '#4b5563' : '#d1d5db'
                    } ${(crossfade.duration / 10) * 100}%, ${
                      isDark ? '#4b5563' : '#d1d5db'
                    } 100%)`
                  }}
                />
                <span className={`text-sm text-secondary-600 dark:text-secondary-300`}>
                  {crossfade.duration}s
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 
