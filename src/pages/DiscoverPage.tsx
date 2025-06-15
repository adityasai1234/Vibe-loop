import React from 'react';
import { Logo } from '../components/Logo';
import { MediaFileList } from '../components/MediaFileList';

export const DiscoverPage: React.FC = () => {
  const handleError = (error: Error) => {
    console.error('Error loading media files:', error);
    // You could show a toast notification here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Logo />
          <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Discover Media
        </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Explore music and videos from the community
          </p>
        </div>

        {/* Media Files Grid */}
        <MediaFileList
          pageSize={20}
          onError={handleError}
          className="mt-8"
        />
        </div>
    </div>
  );
};
