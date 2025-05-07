import React, { useEffect, useState } from 'react';
import { SongCard } from '../components/SongCard';
import { PlaylistCard } from '../components/PlaylistCard';
import { MoodSelector } from '../components/MoodSelector';
import { MoodSongList } from '../components/MoodSongList';
import { songs } from '../data/songs';
import { playlists } from '../data/playlists';
import { users } from '../data/users';
import { useThemeStore } from '../store/themeStore';

interface HomePageProps {
  currentMood?: string | null;
}

export const HomePage: React.FC<HomePageProps> = ({ currentMood: initialMood }) => {
  const { isDark } = useThemeStore();
  const currentUser = users[0];
  const [currentMood, setCurrentMood] = useState<string | null>(initialMood || null);
  
  const recentlyPlayed = currentUser.recentlyPlayed.map(
    id => songs.find(song => song.id === id)
  ).filter(Boolean);
  
  const favoriteSongs = currentUser.favoriteSongs.map(
    id => songs.find(song => song.id === id)
  ).filter(Boolean);
  
  const trendingSongs = [...songs].sort((a, b) => b.likes - a.likes).slice(0, 5);
  
  // Filter songs based on mood if selected
  const [moodFilteredSongs, setMoodFilteredSongs] = useState<typeof songs>([]);
  
  // Handle mood selection from the MoodSelector component
  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    console.log(`HomePage received mood selection: ${mood}`);
  };
  
  useEffect(() => {
    if (currentMood) {
      // In a real app, you would have more sophisticated filtering logic
      // This is a simple example based on genre matching
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
      
      setMoodFilteredSongs(filteredSongs.slice(0, 5));
    } else {
      setMoodFilteredSongs([]);
    }
  }, [currentMood]);
  
  return (
    <div className={`pt-16 md:pl-60 pb-20 min-h-screen w-full transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-black via-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        {/* Mood Selector Component */}
        <section className="mb-10">
          <MoodSelector onMoodSelect={handleMoodSelect} currentMood={currentMood} />
        </section>
        
        {currentMood && (
          <section className="mb-10">
            <MoodSongList mood={currentMood} limit={5} />
          </section>
        )}
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recently Played</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentlyPlayed.map(song => song && (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Playlists</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {playlists.map(playlist => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Trending Now</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {trendingSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Favorites</h2>
            <button className="text-sm text-primary-400 hover:text-primary-300">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favoriteSongs.map(song => song && (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};