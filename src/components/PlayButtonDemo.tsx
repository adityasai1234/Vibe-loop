import React from 'react';
import { PlayButton } from './PlayButton';
import { useThemeStore } from '../store/themeStore';

export const PlayButtonDemo: React.FC = () => {
  const { isDark } = useThemeStore();
  
  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-6">Play Button Component Demo</h2>
      
      <div className="space-y-8">
        {/* Basic usage */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Basic Usage</h3>
          <div className="flex items-center space-x-6">
            <PlayButton />
            <div>
              <p className="font-medium">Default PlayButton</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Plays the default MP3 from GitHub Pages
              </p>
            </div>
          </div>
        </section>
        
        {/* Sizes */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Sizes</h3>
          <div className="flex items-end space-x-6">
            <div className="flex flex-col items-center">
              <PlayButton size="sm" />
              <span className="mt-2 text-sm">Small</span>
            </div>
            <div className="flex flex-col items-center">
              <PlayButton size="md" />
              <span className="mt-2 text-sm">Medium</span>
            </div>
            <div className="flex flex-col items-center">
              <PlayButton size="lg" />
              <span className="mt-2 text-sm">Large</span>
            </div>
          </div>
        </section>
        
        {/* Variants */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Variants</h3>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-center">
              <PlayButton variant="primary" />
              <span className="mt-2 text-sm">Primary</span>
            </div>
            <div className="flex flex-col items-center">
              <PlayButton variant="secondary" />
              <span className="mt-2 text-sm">Secondary</span>
            </div>
            <div className="flex flex-col items-center">
              <PlayButton variant="minimal" />
              <span className="mt-2 text-sm">Minimal</span>
            </div>
          </div>
        </section>
        
        {/* With Label */}
        <section>
          <h3 className="text-xl font-semibold mb-4">With Label</h3>
          <div className="flex items-center space-x-6">
            <PlayButton showLabel />
          </div>
        </section>
        
        {/* Custom Audio Source */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Custom Audio Source</h3>
          <div className="flex items-center space-x-6">
            <PlayButton 
              audioSrc="https://adityasai1234.github.io/static-site-for-vibeloop/youtube_fJ9rUzIMcZQ_audio.mp3"
              songTitle="Custom Song"
              artist="Custom Artist"
              showLabel
            />
          </div>
        </section>
      </div>
      
      <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Implementation Notes:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Uses the app's AudioContext for centralized audio management</li>
          <li>Handles loading states and playback errors</li>
          <li>Provides visual feedback during playback</li>
          <li>Supports different sizes and visual styles</li>
          <li>Logs playback events to console for debugging</li>
        </ul>
      </div>
    </div>
  );
};

export default PlayButtonDemo;
