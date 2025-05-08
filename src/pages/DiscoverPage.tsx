import React, { useState, useEffect } from 'react';
import { Filter, TrendingUp } from 'lucide-react';
import { SongCard } from '../components/SongCard';
import { songs } from '../data/songs';
import { useThemeStore } from '../store/themeStore';

interface DiscoverPageProps {
  currentMood?: string | null;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ currentMood }) => {
  const { isDark } = useThemeStore();
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [moodFilteredSongs, setMoodFilteredSongs] = useState<typeof songs>([]);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  
  // Effect to filter songs based on mood selection
  useEffect(() => {
    if (currentMood) {
      // Simple mood-based filtering logic
      let filteredSongs = [];
      
      switch(currentMood) {
        case 'Happy':
          filteredSongs = songs.filter(song => ['Pop', 'Dance', 'Electronic'].includes(song.genre));
          break;
        case 'Sad':
          filteredSongs = songs.filter(song => ['Indie', 'Alternative', 'Acoustic'].includes(song.genre));
          break;
        case 'Angry':
          filteredSongs = songs.filter(song => ['Rock', 'Metal', 'Punk'].includes(song.genre));
          break;
        case 'Sleepy':
          filteredSongs = songs.filter(song => ['Ambient', 'Classical', 'Chill'].includes(song.genre));
          break;
        case 'Party':
          filteredSongs = songs.filter(song => ['Dance', 'Hip Hop', 'Electronic'].includes(song.genre));
          break;
        case 'Chill':
          filteredSongs = songs.filter(song => ['Chill', 'Lo-fi', 'Jazz'].includes(song.genre));
          break;
        default:
          filteredSongs = [];
      }
      
      setMoodFilteredSongs(filteredSongs);
    } else {
      setMoodFilteredSongs([]);
    }
  }, [currentMood]);

  // Show mini player when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowMiniPlayer(true);
      } else {
        setShowMiniPlayer(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const genres = Array.from(new Set(songs.map(song => song.genre)));
  
  const filteredSongs = activeGenre 
    ? songs.filter(song => song.genre === activeGenre)
    : songs;

  // Toggle compact mode for smaller screens
  const toggleCompactMode = () => {
    setIsCompactMode(!isCompactMode);
  };
  
  return (
    <div className={`pt-16 md:pt-16 md:pl-60 pb-20 min-h-screen w-full transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <div className={`px-4 sm:px-6 py-8 max-w-7xl mx-auto ${isCompactMode ? 'space-y-4' : 'space-y-8'}`}>
        {/* Compact Mode Toggle */}
        <div className="flex justify-end">
          <button 
            onClick={toggleCompactMode}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {isCompactMode ? 'Standard View' : 'Compact View'}
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Discover</h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Find new music and artists you'll love
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <button className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-colors ${
                isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>
            
            <button className="flex items-center space-x-2 bg-primary-500/20 text-primary-400 rounded-full px-4 py-2 hover:bg-primary-500/30 transition-colors">
              <TrendingUp size={18} />
              <span>Trending</span>
            </button>
          </div>
        </div>
        
        {currentMood && moodFilteredSongs.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{currentMood} Mood Recommendations</h2>
              <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${isCompactMode ? 'gap-2' : 'gap-4'}`}>
              {moodFilteredSongs.map(song => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </section>
        )}
        
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Explore Music by Genre 🎵</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveGenre(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                activeGenre === null 
                  ? 'bg-primary-500 text-white' 
                  : isDark 
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            
            {genres.map(genre => (
              <button 
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                  activeGenre === genre 
                    ? 'bg-primary-500 text-white' 
                    : isDark 
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {activeGenre ? `${activeGenre} Tracks` : 'All Tracks'}
            </h2>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${isCompactMode ? 'gap-2' : 'gap-4'}`}>
            {filteredSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Floating Mini Player */}
      {showMiniPlayer && (
        <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 px-4 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center space-x-3 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
          <button className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="text-sm font-medium">Now Playing</div>
        </div>
      )}
    </div>
  );
};