import { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { Logo } from '../components/Logo';
import { MAX_FILE_SIZE } from '../lib/supabaseClient';

// Helper function to format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const UploadPage = () => {
  const handleUploadComplete = (url: string, filePath: string) => {
    console.log('Upload complete:', { url, filePath });
    // TODO: Add any additional logic after upload (e.g., redirect, show success message)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-12 mx-auto mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold mb-2">Upload Your Media</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your music and videos with the world
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Upload Guidelines</h2>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• Supported formats: MP3, MP4</li>
              <li>• Maximum file size: {formatFileSize(MAX_FILE_SIZE)}</li>
              <li>• Files are processed for optimal streaming</li>
              <li>• Your uploads are private by default</li>
            </ul>
          </div>

          <FileUpload onUploadComplete={handleUploadComplete} />
        </div>
      </div>
    </div>
  );
}; 
