import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';
import { useThemeStore } from '../store/themeStore';
import { firestoreService, moodData, SongMetadata } from '../services/firestoreService';

// Using moodData imported from firestoreService

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  currentMood?: string | null;
}

// Using SongMetadata interface from firestoreService

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect, currentMood }) => {
  const { isDark } = useThemeStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(currentMood || null);
  const [moodSongs, setMoodSongs] = useState<SongMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(app);

  // Handle mood selection
  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
    fetchMoodSongs(mood);
    
    // Save user's mood selection to Firestore
    firestoreService.saveUserMood(mood)
      .catch(error => console.error('Error saving mood to Firestore:', error));
  };

  // Fetch songs for the selected mood from Firestore
  const fetchMoodSongs = async (mood: string) => {
    setIsLoading(true);
    try {
      // Use the firestoreService to fetch songs by mood
      const songs = await firestoreService.getSongsByMood(mood);
      setMoodSongs(songs);
      console.log(`Fetched ${songs.length} songs for mood: ${mood}`);
    } catch (error) {
      console.error('Error fetching mood songs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch songs if currentMood is provided
  useEffect(() => {
    if (currentMood) {
      setSelectedMood(currentMood);
      fetchMoodSongs(currentMood);
    }
  }, [currentMood]);

  return (
    <div className="w-full">
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        What's Your Vibe Today? 🎶
      </h2>
      
      {/* Mood Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        {moodData.map((item) => (
          <button
            key={item.mood}
            onClick={() => handleMoodClick(item.mood)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300
              ${selectedMood === item.mood ? 
                (isDark ? 'bg-primary-500/30 ring-2 ring-primary-400' : 'bg-primary-100 ring-2 ring-primary-400') : 
                (isDark ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-100')}
              ${isDark ? 'text-white' : 'text-gray-900'}
              shadow-md hover:shadow-lg transform hover:-translate-y-1
            `}
          >
            <span className="text-4xl mb-2" role="img" aria-label={item.mood}>{item.emoji}</span>
            <span className="font-medium">{item.mood}</span>
            <span className="text-xs mt-1 text-center opacity-70">{item.genres.join(', ')}</span>
          </button>
        ))}
      </div>

      {/* Selected Mood Info */}
      {selectedMood && (
        <div className={`rounded-lg p-6 mb-8 transition-all duration-300 ${
          isDark ? 'bg-gray-800/50' : 'bg-white'
        }`}>
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-3">
              {moodData.find(m => m.mood === selectedMood)?.emoji}
            </span>
            <div>
              <h3 className="text-xl font-bold">{selectedMood} Mood</h3>
              <p className="text-sm opacity-70">
                {moodData.find(m => m.mood === selectedMood)?.genres.join(', ')}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium">Suggested tracks:</p>
            <ul className="list-disc list-inside space-y-1 opacity-80 pl-2">
              {moodData.find(m => m.mood === selectedMood)?.examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-pulse text-primary-400">Loading recommendations...</div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button 
                className={`px-4 py-2 rounded-full font-medium transition-colors ${isDark ? 
                  'bg-primary-500 hover:bg-primary-600 text-white' : 
                  'bg-primary-500 hover:bg-primary-600 text-white'}`}
              >
                Play {selectedMood} Playlist
              </button>
              <button 
                className={`px-4 py-2 rounded-full font-medium transition-colors ${isDark ? 
                  'bg-white/10 hover:bg-white/20 text-white' : 
                  'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                onClick={() => {
                  // Shuffle mood - select a random mood
                  const randomIndex = Math.floor(Math.random() * moodData.length);
                  const randomMood = moodData[randomIndex].mood;
                  handleMoodClick(randomMood);
                }}
              >
                Shuffle Mood
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
