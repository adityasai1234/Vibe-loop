import React from 'react';
import { useSongsStore } from '../store/songsStore';
import { useThemeStore } from '../store/themeStore';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { Play, Heart } from 'lucide-react';

interface MoodCategory {
  emoji: string;
  name: string;
  moods: string[];
}

const moodCategories: MoodCategory[] = [
  {
    emoji: '🎵',
    name: 'All Moods',
    moods: [],
  },
  {
    emoji: '❤️',
    name: 'Romantic',
    moods: ['romantic', 'emotional', 'peaceful'],
  },
  {
    emoji: '💃',
    name: 'Dance',
    moods: ['dance', 'energetic', 'upbeat'],
  },
  {
    emoji: '😌',
    name: 'Chill',
    moods: ['peaceful', 'melancholic', 'emotional'],
  },
  {
    emoji: '🤘',
    name: 'Rock',
    moods: ['epic', 'energetic', 'rebellious'],
  },
  {
    emoji: '🎉',
    name: 'Party',
    moods: ['fun', 'energetic', 'dance'],
  },
];

export const MoodSuggestions: React.FC = () => {
  const { isDark } = useThemeStore();
  const { songs, likedSongs, toggleLike } = useSongsStore();
  const { currentSong, isPlaying, play, pause } = useMusicPlayer();
  const [selectedMood, setSelectedMood] = React.useState<string>('All Moods');

  const filteredSongs = React.useMemo(() => {
    const category = moodCategories.find(cat => cat.name === selectedMood);
    if (!category || category.moods.length === 0) return songs;

    return songs.filter(song => 
      song.mood.some(mood => category.moods.includes(mood))
    );
  }, [songs, selectedMood]);

  const handleLikeClick = (songId: string) => {
    toggleLike(songId);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Mood Suggestions</h2>
      
      {/* Mood Categories */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        {moodCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedMood(category.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
              selectedMood === category.name
                ? isDark
                  ? 'bg-blue-600 text-white dark:text-black'
                  : 'bg-blue-500 text-white dark:text-black'
                : isDark
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-100'
            } transition-colors`}
          >
            <span className="text-xl">{category.emoji}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Song Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            } shadow-md transition-colors group relative`}
          >
            <img
              src={song.coverUrl}
              alt={song.title}
              className="w-full aspect-square object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold truncate">{song.title}</h3>
            <p className="text-sm text-gray-500 truncate">{song.artist}</p>
            
            {/* Play and Like Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  if (currentSong?.id === song.id) {
                    isPlaying ? pause() : play(song);
                  } else {
                    play(song);
                  }
                }}
                className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white dark:text-black"
              >
                <Play size={20} />
              </button>
              <button
                onClick={() => handleLikeClick(song.id)}
                className={`p-2 rounded-full ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                } ${likedSongs.includes(song.id) ? 'text-red-500' : ''}`}
              >
                <Heart size={20} fill={likedSongs.includes(song.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Mood Tags */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {song.mood.map((mood) => (
                <span
                  key={mood}
                  className={`text-xs px-2 py-1 rounded-full ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
