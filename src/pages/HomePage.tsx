import React, { useState, useEffect } from 'react';
import { songs } from '../data/songs';
import { playlists } from '../data/playlists';
import { users } from '../data/users';
import { useThemeStore } from '../store/themeStore';
import { User, Playlist } from '../types/components';
import { Song } from '../types';
import { TimeBasedGreeting, MoodStreak, MoodSelector, DailyDiscoveryMix, MoodSongList, PlaylistCard, MoodShuffle } from '../components';

interface HomePageProps {
  currentMood?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ currentMood: initialMood = null }) => {
  const { isDark } = useThemeStore();
  const currentUser: User = users[0];
  const [currentMood, setCurrentMood] = useState<string>(initialMood || '');
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isMoodSelectorOpen, setIsMoodSelectorOpen] = useState(false);

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

  const recentlyPlayed = currentUser.recentlyPlayed.map(
    (id: string) => songs.find(song => song.id === id)
  ).filter(Boolean) as Song[];

  const favoriteSongs = currentUser.favoriteSongs.map(
    (id: string) => songs.find(song => song.id === id)
  ).filter(Boolean) as Song[];

  const trendingSongs = [...songs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0)).slice(0, 5) as Song[];

  // Filter songs based on mood if selected
  const [moodFilteredSongs, setMoodFilteredSongs] = useState<Song[]>([]);

  // Handle mood selection from the MoodSelector component
  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
    console.log(`HomePage received mood selection: ${mood}`);
  };

  useEffect(() => {
    if (currentMood) {
      // In a real app, you would have more sophisticated filtering logic
      // This is a simple example based on genre matching
      let filteredSongs: Song[] = [];

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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} ${currentMood ? `data-mood-${currentMood}` : ''}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <TimeBasedGreeting user={currentUser} />
            <MoodStreak />
          </div>

          <div 
            onClick={() => setIsMoodSelectorOpen(!isMoodSelectorOpen)}
            className="relative cursor-pointer"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors">
              <span className="text-primary-700">{currentMood || 'Select Mood'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isMoodSelectorOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-2">
                  <div 
                    onClick={() => {
                      setCurrentMood('Happy');
                      setIsMoodSelectorOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Happy</span>
                  </div>
                  <div 
                    onClick={() => {
                      setCurrentMood('Sad');
                      setIsMoodSelectorOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3v.75M9.75 12v.75M9.75 18.75v.75M12 9.75h.75M12 15.75h.75M14.25 3v.75M14.25 12v.75M14.25 18.75v.75M19.5 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Sad</span>
                  </div>
                  <div 
                    onClick={() => {
                      setCurrentMood('Energetic');
                      setIsMoodSelectorOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Energetic</span>
                  </div>
                  <div 
                    onClick={() => {
                      setCurrentMood('Calm');
                      setIsMoodSelectorOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>Calm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {isMoodSelectorOpen && (
          <MoodSelector 
            onSelectMood={(mood: string) => setCurrentMood(mood)}
            onClose={() => setIsMoodSelectorOpen(false)}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="card mood-enter">
              <h2 className="text-xl font-semibold mb-4">Your Daily Mix</h2>
              <DailyDiscoveryMix 
                songs={songs} 
                mood={currentMood} 
              />
            </div>
          </div>

          <div className="col-span-1">
            <div className="card mood-enter">
              <h2 className="text-xl font-semibold mb-4">Recently Played</h2>
              <MoodSongList 
                songs={recentlyPlayed} 
                mood={currentMood} 
              />
            </div>
          </div>

          <div className="col-span-1">
            <div className="card mood-enter">
              <h2 className="text-xl font-semibold mb-4">Favorite Songs</h2>
              <MoodSongList 
                songs={favoriteSongs} 
                mood={currentMood} 
              />
            </div>
          </div>

          <div className="col-span-1">
            <div className="card mood-enter">
              <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
              <MoodSongList 
                songs={trendingSongs} 
                mood={currentMood} 
              />
            </div>
          </div>

          <div className="col-span-1">
            <div className="card mood-enter">
              <h2 className="text-xl font-semibold mb-4">Playlists</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {playlists.map((playlist) => (
                  <PlaylistCard 
                    key={playlist.id}
                    playlist={playlist}
                    mood={currentMood}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="card mood-enter">
              <h2 className="text-xl font-semibold mb-4">Mood Shuffle</h2>
              <MoodShuffle 
                songs={songs}
                mood={currentMood}
                onMoodSelect={(mood: string) => setCurrentMood(mood)}
              />
            </div>
          </div>
        </div>

        {showMiniPlayer && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="/album-cover-placeholder.png" 
                  alt="Current track" 
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">Current Track</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Artist Name</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 008 8v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="p-2 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 008 8v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="p-2 hover:text-primary-600 dark:hover:text-primary-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
