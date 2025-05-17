import React from 'react';
import { useThemeStore } from '../store/themeStore';
import { AlbumCoverPlayer } from '../components/AlbumCoverPlayer';
import { AudioProvider } from '../context/AudioContext';

export const AlbumCoverDemo: React.FC = () => {
  const { isDark } = useThemeStore();

  // Sample album data
  const albums = [
    {
      id: 'sunflower',
      title: 'Sunflower',
      artist: 'Post Malone & Swae Lee',
      coverArt: '/assets/images/sunflower.svg',
      audioSrc: '/assets/audio/sunflower.mp3'
    },
    {
      id: 'swan-lake',
      title: 'Swan Lake',
      artist: 'Tchaikovsky',
      coverArt: '/assets/images/swan_lake.svg',
      audioSrc: '/assets/audio/swan_lake.mp3'
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
          Album Cover Player Demo
        </h1>
        
        <p className="mb-8">
          Click on any album cover below to play the song. Click again to pause. 
          Try clicking on different albums to switch between songs.
        </p>
        
        {/* Hidden audio player element */}
        <audio id="audio-player" style={{ display: 'none' }}></audio>
        
        {/* Album Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {albums.map(album => (
            <div key={album.id} className={`p-4 rounded-xl ${isDark ? 'bg-gray-900/70' : 'bg-white/90'} shadow-lg`}>
              <AlbumCoverPlayer
                audioSrc={album.audioSrc}
                coverArt={album.coverArt}
                songTitle={album.title}
                artist={album.artist}
                className="aspect-square mb-4"
              />
              <h3 className="text-lg font-bold">{album.title}</h3>
              <p className="text-sm opacity-80">{album.artist}</p>
            </div>
          ))}
        </div>
        
        {/* Instructions */}
        <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-900/70 text-white/80' : 'bg-white/90 text-gray-700'} border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <h2 className="text-xl font-bold mb-4">How It Works</h2>
          <p className="mb-4">
            This demo showcases a single-page audio playback feature where users can click on album covers to play music without page navigation.
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

export default AlbumCoverDemo;
