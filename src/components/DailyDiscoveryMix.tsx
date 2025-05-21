import React, { useState, useEffect } from 'react';
import { SongCard } from './SongCard';
import { useThemeStore } from '../store/themeStore';
import { usePlayerStore } from '../store/playerStore';
import { useAudio } from '../context/AudioContext';
import { Song } from '../types';
import { discoveryService } from '../services/discoveryService';

interface DailyDiscoveryMixProps {
  currentMood: string | null;
  limit?: number;
}

export const DailyDiscoveryMix: React.FC<DailyDiscoveryMixProps> = ({ currentMood, limit = 5 }) => {
  const { isDark } = useThemeStore();
  const { setCurrentSong } = usePlayerStore();
  const { play: playAudio } = useAudio();
  const [discoverySongs, setDiscoverySongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscoverySongs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get personalized recommendations using the discovery service
        const recommendedSongs = await discoveryService.getDailyDiscoveryMix(currentMood, limit);
        setDiscoverySongs(recommendedSongs);
      } catch (err) {
        console.error('Error fetching discovery songs:', err);
        setError('Failed to load your daily mix. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoverySongs();
  }, [currentMood, limit]);



  const handlePlayAll = () => {
    if (discoverySongs.length > 0) {
      const firstSong = discoverySongs[0];
      setCurrentSong(firstSong);
      
      // Play the audio
      const songUrl = firstSong.audioSrc || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${firstSong.id}_audio.mp3`;
      playAudio(songUrl, firstSong.title, firstSong.artist);
    }
  };

  return (
    <div className="w-full">
      {/* Banner Section */}
      <section className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Your Daily Discovery Mix</h2>
            <p className="text-blue-100 mb-4 md:mb-0">
              Fresh tracks curated for your {currentMood ? currentMood : 'current'} mood
            </p>
          </div>
          <button 
            onClick={handlePlayAll}
            className="px-4 py-2 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors"
          >
            Listen Now
          </button>
        </div>
      </section>

      {/* Songs Section */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary-500/50 mb-2"></div>
            <div className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Loading your mix...</div>
          </div>
        </div>
      ) : error ? (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      ) : discoverySongs.length === 0 ? (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          No songs found for your discovery mix. Try selecting a mood or check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {discoverySongs.map(song => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyDiscoveryMix;