import React, { useState } from 'react';
import { SimpleSearchBar } from '../components/SimpleSearchBar';
import { Song } from '../types';

const SimpleSearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Music</h1>
      
      <div className="mb-8">
        <SimpleSearchBar 
          onResultsChange={setSearchResults}
        />
      </div>
      
      {searchResults.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Find Your Perfect Track</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Search for songs by title, artist, or genre. Results will appear as you type.
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleSearchPage;
