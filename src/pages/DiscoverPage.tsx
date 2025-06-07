import React, { useState, useMemo } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useSearch } from '../context/SearchContext';
import { songs } from '../data/songs';
import { Play, Pause, Filter, Search } from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const { isDark } = useThemeStore();
  const { currentSong, isPlaying, playSong, pauseSong } = useMusicPlayer();
  const { searchQuery, searchResults } = useSearch();
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('');

  const genres = useMemo(() => Array.from(new Set(songs.map(song => song.genre))), []);
  const moods = useMemo(() => Array.from(new Set(songs.map(song => song.mood))), []);

  const filteredSongs = useMemo(() => {
    let results = searchQuery ? searchResults : songs;
    
    if (selectedGenre) {
      results = results.filter(song => song.genre === selectedGenre);
    }
    if (selectedMood) {
      results = results.filter(song => song.mood === selectedMood);
    }
    
    return results;
  }, [searchQuery, searchResults, selectedGenre, selectedMood]);

  const handlePlay = (song: typeof songs[0]) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong(song);
      }
    } else {
      playSong(song);
    }
  };

  return (
    <div className={`p-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Music'}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className={`appearance-none bg-transparent border rounded-lg px-4 py-2 pr-8 ${
                isDark ? 'border-gray-700 text-white' : 'border-gray-300 text-gray-900'
              }`}
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
            <Filter size={16} className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <div className="relative">
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className={`appearance-none bg-transparent border rounded-lg px-4 py-2 pr-8 ${
                isDark ? 'border-gray-700 text-white' : 'border-gray-300 text-gray-900'
              }`}
            >
              <option value="">All Moods</option>
              {moods.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
            <Filter size={16} className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
        </div>
      </div>

      {filteredSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Search size={48} className={`mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className="text-xl font-semibold mb-2">No songs found</h3>
          <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className={`group relative rounded-lg overflow-hidden ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-lg transition-transform hover:scale-105`}
            >
              <div className="aspect-square relative">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handlePlay(song)}
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity ${
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
                <h3 className="font-semibold truncate">{song.title}</h3>
                <p className={`text-sm truncate ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {song.artist}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className={`${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {song.genre}
                  </span>
                  <span className={`${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {song.mood}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};