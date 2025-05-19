import React, { useState, useEffect } from 'react';
import { MoodSongCard } from './MoodSongCard';
import { firestoreService, SongMetadata } from '../services/firestoreService';
import { useThemeStore } from '../store/themeStore';
import { MousePointerSquareDashed } from 'lucide-react';

interface MoodSongListProps {
  mood: string | null;
  limit?: number;
}

export const MoodSongList: React.FC<MoodSongListProps> = ({ mood, limit = 10 }) => {
  const { isDark } = useThemeStore();
  const [songs, setSongs] = useState<(SongMetadata & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mood) return;
    
    const fetchSongs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const moodSongs = await firestoreService.getSongsByMood(mood);
        setSongs(moodSongs.slice(0, limit) as (SongMetadata & { id: string })[]);
      } catch (err) {
        console.error('Error fetching mood songs:', err);
        setError('Failed to load songs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [mood, limit]);

  const handlePlaySong = (songId: string) => {
    console.log(`Playing song: ${songId}`);
    // In a real app, this would trigger the music player
  };

  const handleAddToFavorites = (songId: string) => {
    firestoreService.addToFavorites(songId)
      .then(() => console.log(`Added song ${songId} to favorites`))
      .catch(err => console.error('Error adding to favorites:', err));
  };

  const handleRateMoodMatch = (songId: string, mood: string, isMatch: boolean) => {
    firestoreService.rateMoodMatch(songId, mood, isMatch)
      .then(() => console.log(`Rated song ${songId} as ${isMatch ? 'matching' : 'not matching'} ${mood} mood`))
      .catch(err => console.error('Error rating mood match:', err));
  };

  if (!mood) {
    return null;
  }

  return (
    <div className="w-full">
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {mood} Mood Songs
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary-500/50 mb-2"></div>
            <div className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Loading songs...</div>
          </div>
        </div>
      ) : error ? (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-700'}`}>
          {error}
        </div>
      ) : songs.length === 0 ? (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          No songs found for {mood} mood. Try another mood or check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {songs.map(song => (
            <MoodSongCard
              key={song.id}
              song={song}
              mood={mood}
              onPlay={() => handlePlaySong(song.id)}
              onAddToFavorites={() => handleAddToFavorites(song.id)}
              onRateMoodMatch={(isMatch) => handleRateMoodMatch(song.id, mood, isMatch)}
            />
          ))}
        </div>
      )}
    </div>
  );              
};
