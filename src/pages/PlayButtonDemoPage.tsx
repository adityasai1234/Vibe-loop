import React from 'react';
import { PlayButtonDemo } from '../components/PlayButtonDemo';
import { useThemeStore } from '../store/themeStore';

export const PlayButtonDemoPage: React.FC = () => {
  const { isDark } = useThemeStore();
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Play Button Component</h1>
        <div className="bg-gray-800/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <PlayButtonDemo />
        </div>
        
        <div className="mt-8 p-6 bg-gray-800/10 backdrop-blur-sm rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Implementation Details</h2>
          <div className="prose dark:prose-invert">
            <p>
              This component demonstrates a reusable PlayButton that plays an MP3 file hosted on GitHub Pages.
              The button uses React's useRef hook to manage the audio element and provides visual feedback
              during playback and error states.
            </p>
            
            <h3>Features:</h3>
            <ul>
              <li>Plays/pauses MP3 audio on click</li>
              <li>Handles loading states with visual feedback</li>
              <li>Provides error handling for playback issues</li>
              <li>Customizable size and style variants</li>
              <li>Optional text labels</li>
              <li>Uses the app's AudioContext for centralized audio management</li>
            </ul>
            
            <h3>Usage Example:</h3>
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto">
              {`import { PlayButton } from '../components/PlayButton';

// Basic usage
<PlayButton />

// With custom audio source
<PlayButton 
  audioSrc="https://example.com/audio.mp3"
  songTitle="My Song"
  artist="Artist Name"
/>

// With different size and style
<PlayButton 
  size="lg"
  variant="secondary"
  showLabel
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayButtonDemoPage;
