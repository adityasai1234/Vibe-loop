import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Song } from '../types';
import { SearchBar } from '../components/SearchBar';
import { SongCard } from '../components/SongCard';

// Define the SearchBar handle interface for TypeScript
interface SearchBarHandle {
  loadMoreResults: () => Promise<void>;
}

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<SearchBarHandle>(null);
  
  // Component is now using local song data
  useEffect(() => {
    // No need to load cache anymore as we're using local data
  }, []);
  
  // Implement infinite scroll using Intersection Observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        // Trigger loading more results in SearchBar component
        setIsLoading(true);
        if (searchBarRef.current) {
          searchBarRef.current.loadMoreResults().finally(() => {
            setIsLoading(false);
          });
        }
      }
    },
    [hasMore, isLoading]
  );
  
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 400px 0px' // Start loading more when user is 400px from the bottom
    });
    
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleObserver]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Music</h1>
      
      <div className="mb-8">
        <SearchBar 
          ref={searchBarRef}
          onResultsChange={setSearchResults}
          onHasMoreChange={setHasMore}
          onTotalChange={setTotal}
          suggestMoodByTime={true}
        />
      </div>
      
      {searchResults.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Discover Your Perfect Sound</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Search for songs by title, artist, or genre. Use filters to find music that matches your mood, activity, or time of day.
            <br />
            <span className="text-blue-400">Try using voice search by clicking the microphone icon!</span>
          </p>
        </div>
      )}
      {searchResults.length > 0 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
          
          {/* Infinite scroll observer target */}
          <div ref={observerTarget} className="h-10 w-full my-4">
            {hasMore && (
              <div className="text-center py-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent">
                </div>
                <p className="mt-2 text-gray-400">Loading more songs...</p>
              </div>
            )}
          </div>
          
          {!hasMore && searchResults.length > 0 && (
            <div className="text-center py-4 text-gray-400">
              {searchResults.length === total ? 
                `Showing all ${total} results` : 
                `Showing ${searchResults.length} of ${total} results`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchPage;
