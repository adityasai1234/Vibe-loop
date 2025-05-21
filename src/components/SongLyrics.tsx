import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { useThemeStore } from '../store/themeStore';

const SongLyrics: React.FC = () => {
  const { currentSong } = usePlayerStore();
  const { isDark } = useThemeStore();
  const [lyrics, setLyrics] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentSong) return;

    const fetchLyrics = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Placeholder implementation - will be replaced with actual API call later
        // This simulates different lyrics based on song mood
        setTimeout(() => {
          if (currentSong.mood && currentSong.mood.length > 0) {
            const mood = currentSong.mood[0].toLowerCase();
            let placeholderLyrics = '';
            
            switch(mood) {
              case 'happy':
                placeholderLyrics = "These are placeholder lyrics for a happy song.\n\nFull of joy and energy,\nMaking you feel light and free.\nDancing through the sunny day,\nChasing all your blues away.";
                break;
              case 'sad':
                placeholderLyrics = "These are placeholder lyrics for a sad song.\n\nMemories fade like autumn leaves,\nWhispers of what used to be.\nTears fall like gentle rain,\nWashing away the hidden pain.";
                break;
              case 'relaxed':
                placeholderLyrics = "These are placeholder lyrics for a relaxed song.\n\nDrifting on a peaceful sea,\nMind and soul completely free.\nGentle waves of calm delight,\nEverything will be alright.";
                break;
              default:
                placeholderLyrics = `These are placeholder lyrics for ${currentSong.title} by ${currentSong.artist}.\n\nLorem ipsum dolor sit amet,\nConsectetur adipiscing elit.\nSed do eiusmod tempor incididunt,\nUt labore et dolore magna aliqua.`;
            }
            
            setLyrics(placeholderLyrics);
          } else {
            setLyrics(`Placeholder lyrics for ${currentSong.title} by ${currentSong.artist}.\n\nLorem ipsum dolor sit amet,\nConsectetur adipiscing elit.\nSed do eiusmod tempor incididunt,\nUt labore et dolore magna aliqua.`);
          }
          setIsLoading(false);
        }, 800);
        
        // Later this will be replaced with:
        // const resp = await fetch(`https://api.lyrics.ovh/v1/${currentSong.artist}/${currentSong.title}`);
        // setLyrics((await resp.json()).lyrics);
      } catch (err) {
        console.error('Error fetching lyrics:', err);
        setError('Could not load lyrics. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchLyrics();
  }, [currentSong]);

  if (!currentSong) {
    return null;
  }

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} mt-4`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">Lyrics</h3>
        <span className="text-xs text-gray-500">{currentSong.title} - {currentSong.artist}</span>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">
          <p>{error}</p>
          <button 
            className="mt-2 text-sm underline"
            onClick={() => setError(null)}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="whitespace-pre-line text-sm leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
          {lyrics}
        </div>
      )}
    </div>
  );
};

export default SongLyrics;