import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { songs } from '../data/songs';
import { SongCard } from './SongCard';
import { useDebounce } from '../hooks/useDebounce';
import { Song } from '../types';

interface SimpleSearchBarProps {
  onResultsChange?: (results: Song[]) => void;
  initialQuery?: string;
}

export const SimpleSearchBar: React.FC<SimpleSearchBarProps> = ({
  onResultsChange,
  initialQuery = '',
}) => {
  // State for search query and results
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Song[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query to avoid excessive filtering
  const debouncedQuery = useDebounce(query, 300);
  
  // Handle search when query changes
  useEffect(() => {
    const searchSongs = () => {
      if (debouncedQuery.trim() === '') {
        setResults([]);
        if (onResultsChange) onResultsChange([]);
        return;
      }
      
      const lowercaseQuery = debouncedQuery.toLowerCase();
      
      // Filter songs based on title, artist, or genre
      const filteredSongs = songs.filter(song => 
        song.title.toLowerCase().includes(lowercaseQuery) ||
        song.artist.toLowerCase().includes(lowercaseQuery) ||
        song.genre.toLowerCase().includes(lowercaseQuery)
      );
      
      setResults(filteredSongs);
      if (onResultsChange) onResultsChange(filteredSongs);
    };
    
    searchSongs();
  }, [debouncedQuery, onResultsChange]);
  
  // Generate search suggestions based on query
  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    // Generate suggestions based on songs data
    const generateSuggestions = () => {
      const lowercaseQuery = query.toLowerCase();
      const titleSuggestions = songs
        .filter(song => song.title.toLowerCase().includes(lowercaseQuery))
        .map(song => song.title);
      
      const artistSuggestions = songs
        .filter(song => song.artist.toLowerCase().includes(lowercaseQuery))
        .map(song => song.artist);
      
      const genreSuggestions = songs
        .filter(song => song.genre.toLowerCase().includes(lowercaseQuery))
        .map(song => song.genre);
      
      // Combine and deduplicate suggestions
      const allSuggestions = [...new Set([...titleSuggestions, ...artistSuggestions, ...genreSuggestions])];
      
      return allSuggestions.slice(0, 5); // Limit to 5 suggestions
    };
    
    setSuggestions(generateSuggestions());
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
  
  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.trim() !== '');
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Clear search input
  const handleClearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Highlight matched text in search results
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? <span key={i} className="bg-primary-500/30">{part}</span> : part
        )}
      </>
    );
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Search input */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search songs, artists, or genres..."
            className="w-full pl-10 pr-20 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
            onFocus={() => setShowSuggestions(query.trim() !== '')}
          />
          
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {/* Search suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search size={14} className="text-gray-400 mr-2" />
                <span>{highlightMatch(suggestion, query)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Search results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {results.map(song => (
            <SongCard 
              key={song.id} 
              song={{
                ...song,
                title: highlightMatch(song.title, debouncedQuery) as any,
                artist: highlightMatch(song.artist, debouncedQuery) as any
              }} 
            />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-8 text-gray-500">
          <p>No songs found matching your search criteria.</p>
        </div>
      ) : null}
    </div>
  );
};
