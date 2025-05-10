import React, { useState, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { firestoreService, SongMetadata } from '../services/firestoreService';

interface EmojiMusicSuggestionsProps {
  onSongSelect?: (song: SongMetadata) => void;
}

interface EmojiCategory {
  name: string;
  emoji: string;
  description: string;
  genres: string[];
}

export const EmojiMusicSuggestions: React.FC<EmojiMusicSuggestionsProps> = ({ onSongSelect }) => {
  const { isDark } = useThemeStore();
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [suggestedSongs, setSuggestedSongs] = useState<SongMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const emojiCategories: EmojiCategory[] = [
    { 
      name: 'Happy', 
      emoji: '😊', 
      description: 'Upbeat and joyful tunes',
      genres: ['Pop', 'Dance', 'Electronic'] 
    },
    { 
      name: 'Chill', 
      emoji: '😌', 
      description: 'Relaxing and calm melodies',
      genres: ['Lo-fi', 'Ambient', 'Acoustic'] 
    },
    { 
      name: 'Energetic', 
      emoji: '🔥', 
      description: 'High-energy beats',
      genres: ['EDM', 'Rock', 'Hip-Hop'] 
    },
    { 
      name: 'Romantic', 
      emoji: '❤️', 
      description: 'Love songs and ballads',
      genres: ['R&B', 'Soul', 'Pop Ballads'] 
    },
    { 
      name: 'Sad', 
      emoji: '😢', 
      description: 'Emotional and melancholic',
      genres: ['Blues', 'Indie', 'Alternative'] 
    },
    { 
      name: 'Party', 
      emoji: '🎉', 
      description: 'Celebration anthems',
      genres: ['Dance', 'Hip-Hop', 'Latin'] 
    },
  ];

  const handleEmojiSelect = async (emoji: string) => {
    setSelectedEmoji(emoji);
    setIsLoading(true);
    
    // Find the category for this emoji
    const category = emojiCategories.find(cat => cat.emoji === emoji);
    
    if (category) {
      try {
        // Get songs by genres associated with this emoji
        const songs = await firestoreService.getSongsByGenres(category.genres);
        setSuggestedSongs(songs);
      } catch (error) {
        console.error('Error fetching songs by emoji:', error);
        setSuggestedSongs([]);
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        How are you feeling today? 🎵
      </h2>
      
      {/* Emoji Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {emojiCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleEmojiSelect(category.emoji)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300
              ${selectedEmoji === category.emoji ? 
                (isDark ? 'bg-primary-500/30 ring-2 ring-primary-400' : 'bg-primary-100 ring-2 ring-primary-400') : 
                (isDark ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-100')}
              ${isDark ? 'text-white' : 'text-gray-900'}
              shadow-md hover:shadow-lg transform hover:-translate-y-1
            `}
          >
            <span className="text-4xl mb-2" role="img" aria-label={category.name}>{category.emoji}</span>
            <span className="font-medium">{category.name}</span>
            <span className="text-xs mt-1 text-center opacity-70">{category.description}</span>
          </button>
        ))}
      </div>

      {/* Song Suggestions */}
      {selectedEmoji && (
        <div className={`rounded-lg p-4 sm:p-6 mb-6 transition-all duration-300 ${
          isDark ? 'bg-gray-800/50' : 'bg-white'
        }`}>
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">
              {selectedEmoji}
            </span>
            <div>
              <h3 className="text-xl font-bold">
                {emojiCategories.find(cat => cat.emoji === selectedEmoji)?.name} Vibes
              </h3>
              <p className="text-sm opacity-70">
                {emojiCategories.find(cat => cat.emoji === selectedEmoji)?.genres.join(', ')}
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-pulse text-primary-400">Finding your vibe...</div>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestedSongs.length > 0 ? (
                <div>
                  <p className="font-medium mb-2">Suggested tracks for your mood:</p>
                  <ul className="space-y-2">
                    {suggestedSongs.map((song, index) => (
                      <li 
                        key={song.id} 
                        className={`p-2 rounded-md flex items-center cursor-pointer ${
                          isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => onSongSelect && onSongSelect(song)}
                      >
                        <div className="w-10 h-10 rounded overflow-hidden mr-3">
                          <img 
                            src={song.albumArt} 
                            alt={song.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{song.title}</p>
                          <p className="text-sm opacity-70">{song.artist}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No songs found for this mood. Try another emoji!</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};