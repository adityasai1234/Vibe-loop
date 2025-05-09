import React, { useState, useEffect } from 'react';
import { firestoreService, SongMetadata } from '../services/firestoreService';
import { useThemeStore } from '../store/themeStore';
import { MoodEntry } from '../types';
import { moodData } from '../services/firestoreService';
import { KeyboardMusic } from 'lucide-react';

interface MoodJournalProps {
  userId?: string;
}

interface JournalEntry extends MoodEntry {
  id?: string;
  note?: string;
  songs?: (SongMetadata & { id: string })[];
}

export const MoodJournal: React.FC<MoodJournalProps> = ({ userId }) => {
  const { isDark } = useThemeStore();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newEntry, setNewEntry] = useState<{
    mood: string;
    note: string;
  }>({ mood: '', note: '' });
  const [recentSongs, setRecentSongs] = useState<(SongMetadata & { id: string })[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const [currentDay, setCurrentDay] = useState<string>('');

  // Get the next 6 days (today + 5 future days)
  const getNextSixDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  // Fetch journal entries and check for today's entry
  useEffect(() => {
    if (!userId) return;
    
    const fetchJournalEntries = async () => {
      setIsLoading(true);
      try {
        const entries = await firestoreService.getUserJournalEntries(userId);
        setJournalEntries(entries);
        
        // Get current day
        const today = new Date();
        const todayStr = today.toLocaleDateString('en-US', { weekday: 'long' });
        setCurrentDay(todayStr);
        
        // Check if there's an entry for today
        const todayEntry = entries.find(entry => {
          const entryDate = new Date(entry.timestamp);
          return (
            entryDate.getDate() === today.getDate() &&
            entryDate.getMonth() === today.getMonth() &&
            entryDate.getFullYear() === today.getFullYear()
          );
        });
        
        if (todayEntry) {
          setTodayEntry(todayEntry);
          // If today is selected, populate the form with today's entry
          if (
            selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
          ) {
            setNewEntry({
              mood: todayEntry.mood,
              note: todayEntry.note || ''
            });
            setSelectedSongs(todayEntry.songs?.map(song => song.id) || []);
          }
        } else {
          setTodayEntry(null);
        }
      } catch (error) {
        console.error('Error fetching journal entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournalEntries();
  }, [userId, selectedDate]);

  // Fetch recently played songs
  useEffect(() => {
    if (!userId) return;
    
    const fetchRecentSongs = async () => {
      try {
        const songs = await firestoreService.getRecentlyPlayedSongs(userId);
        setRecentSongs(songs);
      } catch (error) {
        console.error('Error fetching recent songs:', error);
      }
    };

    fetchRecentSongs();
  }, [userId]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Find entry for this date if it exists
    const existingEntry = journalEntries.find(entry => {
      const entryDate = new Date(entry.timestamp);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });

    if (existingEntry) {
      setNewEntry({
        mood: existingEntry.mood,
        note: existingEntry.note || ''
      });
      setSelectedSongs(existingEntry.songs?.map(song => song.id) || []);
    } else {
      setNewEntry({ mood: '', note: '' });
      setSelectedSongs([]);
    }
  };
  
  // Check if the selected date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  // Check if the date is in the future
  const isFutureDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };
  
  // Check if the form should be disabled
  const isFormDisabled = (): boolean => {
    // If selected date is not today (past or future), form should be disabled
    if (!isToday(selectedDate)) return true;
    
    // If there's already an entry for today, form should be disabled
    return todayEntry !== null;
  };

  const handleMoodChange = (mood: string) => {
    setNewEntry({ ...newEntry, mood });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewEntry({ ...newEntry, note: e.target.value });
  };

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId) 
        : [...prev, songId]
    );
  };

  const handleSaveEntry = async () => {
    if (!userId || !newEntry.mood) return;
    
    try {
      const selectedSongsData = recentSongs.filter(song => 
        selectedSongs.includes(song.id)
      );
      
      await firestoreService.saveJournalEntry({
        userId,
        mood: newEntry.mood,
        note: newEntry.note,
        timestamp: selectedDate.getTime(),
        songs: selectedSongsData
      });
      
      // Refresh entries
      const updatedEntries = await firestoreService.getUserJournalEntries(userId);
      setJournalEntries(updatedEntries);
      
      // Reset form
      setNewEntry({ mood: '', note: '' });
      setSelectedSongs([]);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodInfo = moodData.find(m => m.mood === mood);
    return moodInfo ? moodInfo.emoji : '😐';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`w-full rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Mood Journal
      </h2>
      
      {/* Calendar View - Today + Next 5 Days */}
      <div className="mb-6">
        <div className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Select a date to view or add an entry (only today is available for logging):
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {getNextSixDays().map((date, i) => {
            const isSelected = 
              selectedDate.getDate() === date.getDate() &&
              selectedDate.getMonth() === date.getMonth() &&
              selectedDate.getFullYear() === date.getFullYear();
            
            const hasEntry = journalEntries.some(entry => {
              const entryDate = new Date(entry.timestamp);
              return (
                entryDate.getDate() === date.getDate() &&
                entryDate.getMonth() === date.getMonth() &&
                entryDate.getFullYear() === date.getFullYear()
              );
            });
            
            const entry = journalEntries.find(entry => {
              const entryDate = new Date(entry.timestamp);
              return (
                entryDate.getDate() === date.getDate() &&
                entryDate.getMonth() === date.getMonth() &&
                entryDate.getFullYear() === date.getFullYear()
              );
            });
            
            const dateIsToday = isToday(date);
            const isFuture = isFutureDate(date);
            
            return (
              <button
                key={i}
                onClick={() => handleDateChange(date)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all 
                  ${isSelected
                    ? 'bg-primary-500 text-white'
                    : isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } 
                  ${hasEntry ? 'ring-2 ring-primary-400' : ''}
                  ${isFuture && !dateIsToday ? 'opacity-70' : ''}
                `}
              >
                <span className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-lg font-bold">{date.getDate()}</span>
                {hasEntry && entry?.mood && (
                  <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                )}
                {isFuture && !dateIsToday && (
                  <span className="text-xs mt-1 text-gray-400">Future</span>
                )}
                {dateIsToday && (
                  <span className="text-xs mt-1 text-primary-400 font-medium">Today</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Entry Form */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {formatDate(selectedDate)}
        </h3>
        
        {/* Today's Entry Status Message */}
        {isToday(selectedDate) && todayEntry && (
          <div className={`p-4 mb-4 rounded-lg ${isDark ? 'bg-primary-900/30 text-primary-200' : 'bg-primary-50 text-primary-700'}`}>
            <p className="font-medium">
              You've already logged your mood for today ({currentDay}). Come back tomorrow!
            </p>
          </div>
        )}
        
        {/* Future Date Message */}
        {isFutureDate(selectedDate) && !isToday(selectedDate) && (
          <div className={`p-4 mb-4 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <p className="font-medium">
              This is a future date. You can only log your mood for today.
            </p>
          </div>
        )}
        
        {/* Past Entry Message */}
        {!isToday(selectedDate) && !isFutureDate(selectedDate) && (
          <div className={`p-4 mb-4 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <p className="font-medium">
              You can only log your mood for the current day. Select today's date to add a new entry.
            </p>
          </div>
        )}
        
        {/* Form is only enabled for today and if no entry exists */}
        {(isToday(selectedDate) && !todayEntry) ? (
          <>
            {/* Mood Selection */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                How are you feeling today?
              </label>
              <div className="flex flex-wrap gap-2">
                {moodData.map((mood) => (
                  <button
                    key={mood.mood}
                    onClick={() => handleMoodChange(mood.mood)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-all ${newEntry.mood === mood.mood
                      ? 'bg-primary-500 text-white'
                      : isDark
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <span>{mood.emoji}</span>
                    <span>{mood.mood}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Journal Note */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Journal Entry
              </label>
              <textarea
                value={newEntry.note}
                onChange={handleNoteChange}
                placeholder="Write about your day and how music affected your mood..."
                className={`w-full p-3 rounded-lg border ${isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-primary-500 focus:border-primary-500`}
                rows={4}
              />
            </div>
            
            {/* Song Selection */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Songs that matched your mood today
              </label>
              {recentSongs.length === 0 ? (
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  No recently played songs found.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}">
                  {recentSongs.map(song => (
                    <div 
                      key={song.id}
                      onClick={() => toggleSongSelection(song.id)}
                      className={`flex items-center p-2 cursor-pointer transition-all ${selectedSongs.includes(song.id)
                        ? isDark ? 'bg-primary-900/30' : 'bg-primary-50'
                        : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                      } ${isDark ? 'border-gray-700' : 'border-gray-200'} border-b last:border-b-0`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 mr-3">
                        <img 
                          src={song.coverImageUrl} 
                          alt={song.title} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {song.title}
                        </p>
                        <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {song.artist}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <input 
                          type="checkbox" 
                          checked={selectedSongs.includes(song.id)}
                          onChange={() => {}} // Handled by the parent div's onClick
                          className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSaveEntry}
              disabled={!newEntry.mood}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${!newEntry.mood
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              Save Journal Entry
            </button>
          </>
        ) : (
          // View-only mode for past entries or today's entry that already exists
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {journalEntries.find(entry => {
              const entryDate = new Date(entry.timestamp);
              return (
                entryDate.getDate() === selectedDate.getDate() &&
                entryDate.getMonth() === selectedDate.getMonth() &&
                entryDate.getFullYear() === selectedDate.getFullYear()
              );
            }) ? (
              <div>
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">
                    {getMoodEmoji(newEntry.mood)}
                  </span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {newEntry.mood}
                  </span>
                </div>
                
                {newEntry.note && (
                  <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {newEntry.note}
                  </p>
                )}
                
                {selectedSongs.length > 0 && (
                  <div>
                    <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Songs from this day:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {recentSongs
                        .filter(song => selectedSongs.includes(song.id))
                        .map(song => (
                          <div 
                            key={song.id}
                            className={`flex items-center p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                          >
                            <img 
                              src={song.coverImageUrl} 
                              alt={song.title} 
                              className="w-6 h-6 object-cover rounded mr-2"
                            />
                            <span className={`text-sm truncate max-w-[150px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {song.title}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No entry found for this date.
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Journal History */}
      <div>
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recent Journal Entries
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary-500/50 mb-2"></div>
              <div className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>Loading entries...</div>
            </div>
          </div>
        ) : journalEntries.length === 0 ? (
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            No journal entries yet. Start tracking your mood today!
          </div>
        ) : (
          <div className="space-y-3">
            {journalEntries
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 5)
              .map((entry, index) => (
                <div 
                  key={entry.id || index}
                  className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{getMoodEmoji(entry.mood)}</span>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {entry.mood}
                      </span>
                    </div>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(new Date(entry.timestamp))}
                    </span>
                  </div>
                  
                  {entry.note && (
                    <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {entry.note}
                    </p>
                  )}
                  
                  {entry.songs && entry.songs.length > 0 && (
                    <div>
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Songs from this day:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {entry.songs.map(song => (
                          <div 
                            key={song.id}
                            className={`flex items-center p-1 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                          >
                            <img 
                              src={song.coverImageUrl} 
                              alt={song.title} 
                              className="w-6 h-6 object-cover rounded mr-1"
                            />
                            <span className={`text-xs truncate max-w-[120px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {song.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodJournal;