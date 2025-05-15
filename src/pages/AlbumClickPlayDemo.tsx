import React from 'react';
import { useThemeStore } from '../store/themeStore';
import { AlbumGrid } from '../components/AlbumGrid';

export const AlbumClickPlayDemo: React.FC = () => {
  const { isDark } = useThemeStore();

  // Sample album data
  const albums = [
    {
      id: 'sunflower',
      title: 'Sunflower',
      artist: 'Post Malone & Swae Lee',
      coverArt: '/assets/images/sunflower.svj.png',
      audioSrc: '/assets/audio/youtube_ApXoWvfEYVU_audio.mp3'
    },
    {
      id: 'bohemian-rhapsody',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      coverArt: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png',
      audioSrc: '/music/youtube_fJ9rUzIMcZQ_audio.mp3'
    }
  ];

  return (
    <div className={`min-h-screen pt-20 pb-32 px-4 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
          Music Collection
        </h1>
        
        <p className="mb-8">
          Click on any album cover below to play the song. Click again to pause.
        </p>
        
        {/* Album Grid with click-to-play functionality */}
        <AlbumGrid albums={albums} className="mb-12" />
        
        {/* Instructions */}
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-900/70 text-white/80' : 'bg-white/90 text-gray-700'} border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <h2 className="text-xl font-bold mb-4">How It Works</h2>
          <p className="mb-4">
            This page demonstrates a single-page audio playback feature where users can click on album covers to play music without page navigation.
            The implementation uses a hidden HTML audio element controlled by JavaScript.
          </p>
          <p>
            When you click an album cover:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>If the song isn't playing, it starts playback</li>
            <li>If the song is already playing, it pauses</li>
            <li>If a different song is playing, it switches to the new selection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlbumClickPlayDemo;