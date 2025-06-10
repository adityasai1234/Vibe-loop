import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { moods } from '../data/moods';
import { songs } from '../data/songs';
import { SongCard } from '../components/SongCard';
import { useMoodStore } from '../store/moodStore';
import { useThemeStore } from '../store/themeStore';

export const MoodPage: React.FC = () => {
  const { isDark } = useThemeStore();
  const { entries, selectedMood, addEntry, setSelectedMood } = useMoodStore();
  const [note, setNote] = useState('');
  
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };
  
  const handleSaveMood = () => {
    const currentMood = moods.find(m => m.emoji === selectedMood);
    if (!currentMood) return;
    
    addEntry({
      date: new Date().toISOString(),
      mood: selectedMood,
      songs: currentMood.songIds,
      note: note.trim() || undefined
    });
    
    setNote('');
    setSelectedMood(null);
  };
  
  const recommendedSongs = selectedMood
    ? moods.find(m => m.emoji === selectedMood)?.songIds.map(
        id => songs.find(s => s.id === id)
      ).filter(Boolean) || []
    : [];
  
  return (
    <div className={`p-8 transition-colors duration-300 ${
      isDark 
        ? 'text-secondary-100' 
        : 'text-secondary-900'
    }`}>
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold mb-4">How are you feeling today?</h1>
        <p className={`mb-8 ${isDark ? 'text-secondary-300' : 'text-secondary-700'}`}>
          Select a mood to get personalized music recommendations
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {moods.map((mood) => (
            <button
              key={mood.emoji}
              onClick={() => handleMoodSelect(mood.emoji)}
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-200 ${
                selectedMood === mood.emoji
                  ? `bg-primary-600 text-white shadow-md transform scale-105`
                  : isDark
                    ? 'bg-secondary-900 hover:bg-secondary-800'
                    : 'bg-white hover:bg-secondary-100 shadow-sm'
              }`}
            >
              <span className="text-4xl mb-2">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>
        
        {selectedMood && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Recommended Songs</h2>
              <div className="grid grid-cols-1 gap-4">
                {recommendedSongs.map(song => song && (
                  <SongCard key={song.id} song={song} size="small" />
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-secondary-200' : 'text-secondary-700'
              }`}>
                How are you feeling? (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors duration-200 ${
                  isDark
                    ? 'bg-secondary-800 border-secondary-700 text-secondary-100 placeholder-secondary-400 focus:ring-primary-600'
                    : 'bg-white border-secondary-300 text-secondary-900 placeholder-secondary-500 focus:ring-primary-500'
                }`}
                placeholder="Share your thoughts..."
                rows={3}
              />
            </div>
            
            <button
              onClick={handleSaveMood}
              className={`bg-primary-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-600 transition-colors duration-200`}
            >
              Save to Mood Journal
            </button>
          </>
        )}
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Recent Mood Entries</h2>
          <div className="space-y-4">
            {entries.slice(-5).reverse().map(entry => {
              const entryDate = new Date(entry.date);
              const entrySongs = entry.songs
                .map(id => songs.find(s => s.id === id))
                .filter(Boolean);
              
              return (
                <div
                  key={entry.id}
                  className={`p-4 rounded-lg shadow-sm transition-colors duration-200 ${
                    isDark ? 'bg-secondary-900' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} className="text-primary-500" />
                      <span className={`text-sm ${
                        isDark ? 'text-secondary-200' : 'text-secondary-700'
                      }`}>
                        {entryDate.toLocaleDateString()}
                      </span>
                      <Clock size={18} className="text-primary-500 ml-4" />
                      <span className={`text-sm ${
                        isDark ? 'text-secondary-200' : 'text-secondary-700'
                      }`}>
                        {entryDate.toLocaleTimeString()}
                      </span>
                    </div>
                    <span className="text-3xl">{entry.mood}</span>
                  </div>
                  
                  {entry.note && (
                    <p className={`text-sm mb-3 ${
                      isDark ? 'text-secondary-300' : 'text-secondary-600'
                    }`}>
                      {entry.note}
                    </p>
                  )}
                  
                  <div className={`text-sm ${
                    isDark ? 'text-primary-400' : 'text-primary-600'
                  }`}>
                    {entrySongs.map(song => song?.title).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};