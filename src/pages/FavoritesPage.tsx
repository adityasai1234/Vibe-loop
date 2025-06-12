import React from 'react';

export const FavoritesPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Favorites will be displayed here */}
        <p className="text-gray-500">Your favorite songs will appear here</p>
      </div>
    </div>
  );
}; 
