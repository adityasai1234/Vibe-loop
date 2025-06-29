import { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { Logo } from '../components/Logo';
import { DebugEnv } from '../components/DebugEnv';
import { Notification } from '../components/Notification';
// import { MAX_FILE_SIZE } from '../lib/supabaseClient';
// Supabase is disabled, so define MAX_FILE_SIZE locally:
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
import { eventEmitter, EVENTS } from '../lib/events';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const UploadPage = () => {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleUploadComplete = (url: string) => {
    console.log('Upload complete:', { url });
    // Show success notification
    setNotification({
      type: 'success',
      message: 'File uploaded successfully! It will appear on the home page shortly.',
    });
    eventEmitter.emit(EVENTS.FILE_UPLOADED, { url });
  };

  const handleUploadSuccess = (result: any) => {
    console.log('Upload success with full result:', result);
    // Show success notification
    setNotification({
      type: 'success',
      message: `Song "${result.song.title}" uploaded successfully!`,
    });
    eventEmitter.emit(EVENTS.FILE_UPLOADED, result);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

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

        {/* Debug component - remove this in production */}
        <div className="mb-6">
          <DebugEnv />
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

          <FileUpload 
            onUploadComplete={handleUploadComplete}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      </div>
    </div>
  );
}; 
