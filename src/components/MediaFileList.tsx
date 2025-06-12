import React from 'react';
import { useCursorPagination } from '../hooks/useCursorPagination';
import { Music, Video, Loader2 } from 'lucide-react';
import type { Database } from '../types/supabase';

type MediaFile = Database['public']['Tables']['media_files']['Row'];

interface MediaFileListProps {
  pageSize?: number;
  ownerId?: string;
  onError?: (error: Error) => void;
  className?: string;
}

export const MediaFileList: React.FC<MediaFileListProps> = ({
  pageSize = 20,
  ownerId,
  onError,
  className = '',
}) => {
  const {
    items,
    loading,
    error,
    hasMore,
    loadMore,
  } = useCursorPagination({
    pageSize,
    ownerId,
    onError,
  });

  const isAudio = (fileName: string) => fileName.toLowerCase().endsWith('.mp3');
  const isVideo = (fileName: string) => fileName.toLowerCase().endsWith('.mp4');

  if (error) {
    return (
      <div className="p-4 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Error loading media files: {error.message}
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No media files found
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Media Files List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((file) => (
          <div
            key={file.id}
            className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-700">
              {isAudio(file.file_name) ? (
                <div className="flex items-center justify-center h-full">
                  <Music className="w-12 h-12 text-accent-500" />
                </div>
              ) : isVideo(file.file_name) ? (
                <div className="flex items-center justify-center h-full">
                  <Video className="w-12 h-12 text-accent-500" />
                </div>
              ) : null}
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {file.file_name}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {new Date(file.inserted_at).toLocaleDateString()}
              </p>
            </div>

            {/* Hover overlay with play button */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                className="p-3 bg-accent-500 rounded-full text-white transform scale-0 group-hover:scale-100 transition-transform duration-200"
                aria-label={`Play ${file.file_name}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className={`
              px-6 py-2 rounded-lg font-medium
              transition-colors duration-200
              flex items-center space-x-2
              ${
                loading
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-accent-500 hover:bg-accent-600 text-white'
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More</span>
            )}
          </button>
        </div>
      )}

      {/* End of List Message */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
          You've reached the end of the list
        </div>
      )}
    </div>
  );
}; 