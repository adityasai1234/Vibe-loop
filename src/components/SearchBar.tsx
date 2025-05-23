import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Filter, Clock, Activity, Music, Mic } from 'lucide-react';
import { Song } from '../types';
import { searchSongs, getMoodSuggestionsByTime, getActivitySuggestions } from '../data/songs';
import { SongCard } from './SongCard';
import { useDebounce } from '../hooks/useDebounce';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

// Define mood options for filtering
const moodOptions = [
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'chill', label: 'Chill' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'nostalgic', label: 'Nostalgic' },
  { value: 'dreamy', label: 'Dreamy' },
  { value: 'confident', label: 'Confident' },
  { value: 'peaceful', label: 'Peaceful' },
  { value: 'contemplative', label: 'Contemplative' }
];

// Define activity options for filtering
const activityOptions = [
  { value: 'study', label: 'Study' },
  { value: 'workout', label: 'Workout' },
  { value: 'party', label: 'Party' },
  { value: 'relaxing', label: 'Relaxing' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'commuting', label: 'Commuting' },
  { value: 'reading', label: 'Reading' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'driving', label: 'Driving' },
  { value: 'sleeping', label: 'Sleeping' }
];

// Define time of day options for filtering
const timeOfDayOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'night', label: 'Night' },
  { value: 'day', label: 'Day' }
];

// Define genre options for filtering
const genreOptions = [
  { value: 'Lo-fi', label: 'Lo-fi' },
  { value: 'Chill', label: 'Chill' },
  { value: 'Electronic', label: 'Electronic' },
  { value: 'Ambient', label: 'Ambient' },
  { value: 'Hip Hop', label: 'Hip Hop' },
  { value: 'Pop', label: 'Pop' },
  { value: 'Indie', label: 'Indie' },
  { value: 'Synthwave', label: 'Synthwave' },
  { value: 'Jazz', label: 'Jazz' }
];

interface SearchBarProps {
  onResultsChange?: (results: Song[]) => void;
  initialQuery?: string;
  suggestMoodByTime?: boolean;
  onHasMoreChange?: (hasMore: boolean) => void;
  onTotalChange?: (total: number) => void;
}

interface SearchBarHandle {
  loadMoreResults: () => Promise<void>;
}

export const SearchBar = React.forwardRef<SearchBarHandle, SearchBarProps>((
  {
    onResultsChange,
    initialQuery = '',
    suggestMoodByTime = true,
    onHasMoreChange,
    onTotalChange
  }, ref
) => {
  // State for search query and results
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  
  // Voice search integration
  const { isListening, transcript, startListening, stopListening, error: voiceError } = useVoiceSearch();
  
  // State for filters
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 200);
  
  // Effect for voice search transcript
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);
  
  // Get time-based mood and activity suggestions
  useEffect(() => {
    if (suggestMoodByTime) {
      // Get suggestions based on time of day
      try {
        const timeMoods = getMoodSuggestionsByTime();
        const activitySuggestions = getActivitySuggestions();
        
        if (timeMoods.length > 0) {
          setSelectedMoods(timeMoods.slice(0, 2)); // Select top 2 mood suggestions
        }
        
        if (activitySuggestions.length > 0) {
          setSelectedActivities(activitySuggestions.slice(0, 1)); // Select top activity suggestion
        }
      } catch (error) {
        console.error('Error getting time-based suggestions:', error);
        // Fall back to time-based suggestions
        suggestByTimeOfDay();
      }
    }
  }, [suggestMoodByTime]);
  
  // Suggest mood based on time of day as fallback
  const suggestByTimeOfDay = useCallback(() => {
    const currentHour = new Date().getHours();
    let suggestedMood: string[] = [];
    let suggestedTime: string[] = [];
    
    if (currentHour >= 5 && currentHour < 12) {
      // Morning: 5 AM - 12 PM
      suggestedMood = ['energetic', 'happy'];
      suggestedTime = ['morning'];
    } else if (currentHour >= 12 && currentHour < 17) {
      // Afternoon: 12 PM - 5 PM
      suggestedMood = ['confident', 'energetic'];
      suggestedTime = ['afternoon', 'day'];
    } else if (currentHour >= 17 && currentHour < 21) {
      // Evening: 5 PM - 9 PM
      suggestedMood = ['relaxed', 'nostalgic'];
      suggestedTime = ['evening'];
    } else {
      // Night: 9 PM - 5 AM
      suggestedMood = ['chill', 'dreamy'];
      suggestedTime = ['night'];
    }
    
    if (selectedMoods.length === 0) {
      setSelectedMoods(suggestedMood);
    }
    
    if (selectedTimes.length === 0) {
      setSelectedTimes(suggestedTime);
    }
  }, [selectedMoods.length, selectedTimes.length]);
  
  // Handle search when query or filters change
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim() === '' && 
          selectedMoods.length === 0 && 
          selectedActivities.length === 0 && 
          selectedTimes.length === 0 && 
          selectedGenre === '') {
        setResults([]);
        setHasMore(false);
        setTotal(0);
        if (onResultsChange) onResultsChange([]);
        if (onHasMoreChange) onHasMoreChange(false);
        if (onTotalChange) onTotalChange(0);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Reset offset when search parameters change
        const newOffset = 0;
        setOffset(newOffset);
        
        // Call the search function from our local data
        const searchResults = searchSongs({
          query: debouncedQuery,
          mood: selectedMoods,
          activity: selectedActivities,
          timeOfDay: selectedTimes,
          genre: selectedGenre,
          limit: 20,
          offset: newOffset
        });
        
        setResults(searchResults.documents as Song[]);
        setHasMore(searchResults.hasMore || false);
        setTotal(searchResults.total || 0);
        
        if (onResultsChange) onResultsChange(searchResults.documents as Song[]);
        if (onHasMoreChange) onHasMoreChange(searchResults.hasMore || false);
        if (onTotalChange) onTotalChange(searchResults.total || 0);
      } catch (error) {
        console.error('Error searching songs:', error);
        setResults([]);
        setHasMore(false);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [debouncedQuery, selectedMoods, selectedActivities, selectedTimes, selectedGenre, onResultsChange, onHasMoreChange, onTotalChange]);
  
  // Expose loadMoreResults function to parent component
  React.useImperativeHandle(ref, () => ({
    loadMoreResults: async () => {
      if (!hasMore || isLoading) return;
      
      setIsLoading(true);
      
      try {
        const newOffset = offset + 20;
        setOffset(newOffset);
        
        const searchResults = searchSongs({
          query: debouncedQuery,
          mood: selectedMoods,
          activity: selectedActivities,
          timeOfDay: selectedTimes,
          genre: selectedGenre,
          limit: 20,
          offset: newOffset
        });
        
        setResults(prevResults => [...prevResults, ...searchResults.documents as Song[]]);
        setHasMore(searchResults.hasMore || false);
        setTotal(searchResults.total || 0);
        
        if (onResultsChange) onResultsChange([...results, ...searchResults.documents as Song[]]);
        if (onHasMoreChange) onHasMoreChange(searchResults.hasMore || false);
        if (onTotalChange) onTotalChange(searchResults.total || 0);
      } catch (error) {
        console.error('Error loading more results:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }));
  
  // Generate search suggestions based on query
  useEffect(() => {
    if (query.trim().length > 1) {
      // Generate suggestions based on query
      const queryLower = query.toLowerCase();
      const genreSuggestions = genreOptions
        .filter(genre => genre.label.toLowerCase().includes(queryLower))
        .map(genre => genre.label);
      
      const moodSuggestions = moodOptions
        .filter(mood => mood.label.toLowerCase().includes(queryLower))
        .map(mood => mood.label);
      
      const activitySuggestions = activityOptions
        .filter(activity => activity.label.toLowerCase().includes(queryLower))
        .map(activity => activity.label);
      
      // Combine and deduplicate suggestions
      const allSuggestions = [...genreSuggestions, ...moodSuggestions, ...activitySuggestions];
      const uniqueSuggestions = [...new Set(allSuggestions)];
      
      setSuggestions(uniqueSuggestions.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(uniqueSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);
  
  // Handle click outside suggestions to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedMoods([]);
    setSelectedActivities([]);
    setSelectedTimes([]);
    setSelectedGenre('');
  };
  
  // Toggle mood selection
  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood) 
        : [...prev, mood]
    );
  };
  
  // Toggle activity selection
  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity) 
        : [...prev, activity]
    );
  };
  
  // Toggle time of day selection
  const toggleTimeOfDay = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time) 
        : [...prev, time]
    );
  };
  
  // Set genre selection
  const selectGenre = (genre: string) => {
    setSelectedGenre(prev => prev === genre ? '' : genre);
  };
  
  // Clear search query
  const clearSearch = () => {
    setQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Handle voice search
  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  return (
    <div className="w-full">
      {/* Search input with voice search */}
      <div className="relative mb-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400" size={18} />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, artist, or genre..."
            className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-12 text-gray-400 hover:text-gray-200"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={handleVoiceSearch}
            className={`absolute right-3 p-1 rounded-full ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-gray-200'}`}
            aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
          >
            <Mic size={18} />
          </button>
        </div>
        
        {/* Search suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg"
          >
            <ul>
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Filter toggle and clear button */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={toggleFilters}
          className="flex items-center text-sm text-gray-300 hover:text-white"
        >
          <Filter size={16} className="mr-1" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {(selectedMoods.length > 0 || selectedActivities.length > 0 || selectedTimes.length > 0 || selectedGenre) && (
          <button 
            onClick={clearFilters}
            className="text-sm text-gray-300 hover:text-white"
          >
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Filters section */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          {/* Mood filter */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Activity size={16} className="mr-2 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-300">Mood</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => toggleMood(mood.value)}
                  className={`px-3 py-1 text-xs rounded-full ${selectedMoods.includes(mood.value) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Activity filter */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Activity size={16} className="mr-2 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-300">Activity</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map((activity) => (
                <button
                  key={activity.value}
                  onClick={() => toggleActivity(activity.value)}
                  className={`px-3 py-1 text-xs rounded-full ${selectedActivities.includes(activity.value) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {activity.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Time of day filter */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Clock size={16} className="mr-2 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-300">Time of Day</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {timeOfDayOptions.map((time) => (
                <button
                  key={time.value}
                  onClick={() => toggleTimeOfDay(time.value)}
                  className={`px-3 py-1 text-xs rounded-full ${selectedTimes.includes(time.value) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {time.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Genre filter */}
          <div>
            <div className="flex items-center mb-2">
              <Music size={16} className="mr-2 text-gray-400" />
              <h3 className="text-sm font-medium text-gray-300">Genre</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {genreOptions.map((genre) => (
                <button
                  key={genre.value}
                  onClick={() => selectGenre(genre.value)}
                  className={`px-3 py-1 text-xs rounded-full ${selectedGenre === genre.value ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {genre.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Search results */}
      {isLoading && results.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-400">Searching...</p>
        </div>
      )}
      
      {!isLoading && results.length === 0 && debouncedQuery && (
        <div className="text-center py-8">
          <p className="text-gray-400">No songs found. Try a different search or filter.</p>
        </div>
      )}
      {results.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-4">{total} songs found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;
