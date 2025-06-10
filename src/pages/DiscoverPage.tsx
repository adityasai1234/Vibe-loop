import React, { useState, useMemo } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useSearch } from '../context/SearchContext';
import { songs } from '../data/songs';
import { Play, Pause, Filter, Search } from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const { isDark } = useThemeStore();
  const { currentSong, isPlaying, play, pause } = useMusicPlayer();
  const { searchQuery, searchResults } = useSearch();
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('');

  const genres = useMemo(() => Array.from(new Set(songs.map(song => song.genre))), []);
  const moods = useMemo(() => Array.from(new Set(songs.flatMap(song => song.mood))), []);

  const filteredSongs = useMemo(() => {
    let results = searchQuery ? searchResults : songs;
    
    if (selectedGenre) {
      results = results.filter(song => song.genre === selectedGenre);
    }
    if (selectedMood) {
      results = results.filter(song => song.mood.includes(selectedMood));
    }
    
    return results;
  }, [searchQuery, searchResults, selectedGenre, selectedMood]);

  const handlePlay = (song: typeof songs[0]) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        pause();
      }
    } else {
      play(song);
    }
  };

  return (
    <div className={`p-8 transition-colors duration-300 ${
      isDark ? 'text-secondary-100' : 'text-secondary-900'
    }`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Music'}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className={`appearance-none bg-transparent border rounded-lg px-4 py-2 pr-8 transition-colors duration-200 ${
                isDark ? 'border-secondary-700 text-secondary-100' : 'border-secondary-300 text-secondary-900'
              }`}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <Filter size={16} className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
              isDark ? 'text-secondary-400' : 'text-secondary-500'
            }`} />
          </div>
          <div className="relative">
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className={`appearance-none bg-transparent border rounded-lg px-4 py-2 pr-8 transition-colors duration-200 ${
                isDark ? 'border-secondary-700 text-secondary-100' : 'border-secondary-300 text-secondary-900'
              }`}
            >
              <option value="">All Moods</option>
              {moods.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
            <Filter size={16} className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
              isDark ? 'text-secondary-400' : 'text-secondary-500'
            }`} />
          </div>
        </div>
      </div>

      {filteredSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Search size={48} className={`mb-4 transition-colors duration-200 ${
            isDark ? 'text-secondary-600' : 'text-secondary-400'}`} />
          <h3 className="text-xl font-semibold mb-2">No songs found</h3>
          <p className={`text-center transition-colors duration-200 ${
            isDark ? 'text-secondary-400' : 'text-secondary-500'}`}>
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className={`group relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-105 ${
                isDark ? 'bg-secondary-900' : 'bg-white'
              }`}
            >
              <div className="aspect-square relative">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handlePlay(song)}
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    isDark ? 'text-white' : 'text-white'
                  }`}
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <Pause size={48} />
                  ) : (
                    <Play size={48} />
                  )}
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate text-lg">{song.title}</h3>
                <p className={`text-sm truncate ${
                  isDark ? 'text-secondary-400' : 'text-secondary-600'
                }`}>
                  {song.artist}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-secondary-800 text-secondary-300' : 'bg-secondary-100 text-secondary-600'
                  }`}>
                    {song.genre}
                  </span>
                  <span className={`text-secondary-400' : 'text-secondary-500'}`}>
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-2">
                  {song.mood.map(m => (
                    <span key={m} className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
                      isDark ? 'bg-secondary-800 text-secondary-300' : 'bg-secondary-100 text-secondary-600'
                    }`}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};