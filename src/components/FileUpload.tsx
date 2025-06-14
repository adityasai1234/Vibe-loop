import React, { useCallback, useState, useEffect } from 'react';
import { Upload, X, Music, Video, AlertCircle } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';

// Helper function to format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

interface FileUploadProps {
  onUploadComplete?: (url: string, filePath: string) => void;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null); // To store file for display
  const { state, onChange: handleFileUploadChange } = useFileUpload();

  // Handle the onUploadComplete prop when the hook's state is 'done'
  useEffect(() => {
    if (state.phase === 'done' && onUploadComplete) {
      // Note: The new useFileUpload hook does not return filePath directly.
      // We are passing localFile?.name as a placeholder. Review if actual filePath is needed.
      onUploadComplete(state.url, localFile?.name || '');
    }
  }, [state, onUploadComplete, localFile]);

  const handleSelectAndUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalFile(file); // Store file for display
      handleFileUploadChange(e); // Pass the event directly to the hook
    } else {
      setLocalFile(null); // Clear file if selection is cancelled
    }
  }, [handleFileUploadChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Create a synthetic ChangeEvent to pass to the hook's onChange
      const syntheticEvent = {
        target: { files: [droppedFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      setLocalFile(droppedFile); // Store file for display
      handleFileUploadChange(syntheticEvent);
    } else {
      setLocalFile(null);
    }
  }, [handleFileUploadChange]);

  const handleRemoveFile = useCallback(() => {
    setLocalFile(null);
    // The useFileUpload hook does not provide a reset function for its internal state.
    // If a complete reset of the upload process is needed, the hook would require a reset method.
  }, []);

  const isAudio = localFile?.type?.startsWith('audio/');
  const isVideo = localFile?.type?.startsWith('video/');
  const displayErrorMessage = state.phase === 'error' ? state.msg : null;

  const ALL_ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'video/mp4']; // From useFileUpload
  const MAX_FILE_SIZE_MB = 100; // From useFileUpload

  return (
    <div className={`w-full max-w-xl mx-auto ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6
          ${isDragging ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20' : 'border-gray-300 dark:border-gray-700'}
          ${displayErrorMessage ? 'border-red-500 dark:border-red-400' : ''}
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={ALL_ALLOWED_TYPES.join(',')}
          onChange={handleSelectAndUpload}
          className="hidden"
          id="file-upload"
          disabled={state.phase === 'uploading'}
        />
        
        {state.phase === 'idle' && !localFile ? (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Drag and drop your file here, or{' '}
              <span className="text-accent-500 font-medium">browse</span>
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Supported formats: {ALL_ALLOWED_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ')} (max {MAX_FILE_SIZE_MB} MB)
            </p>
          </label>
        ) : (
          <div className="space-y-4">
            {localFile && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {isAudio ? (
                    <Music className="w-8 h-8 text-accent-500" />
                  ) : (
                    <Video className="w-8 h-8 text-accent-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {localFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(localFile.size)}
                    </p>
                  </div>
                </div>
                {state.phase !== 'uploading' && (
                  <button
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    aria-label="Remove file"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>
            )}

            {state.phase === 'uploading' && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 transition-all duration-300"
                    style={{ width: `${state.pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Uploading... {Math.round(state.pct)}%
                </p>
              </div>
            )}

            {state.phase === 'done' && (
              <div className="text-center">
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                  Upload complete!
                </p>
                {isAudio ? (
                  <audio controls className="w-full">
                    <source src={state.url} type={localFile?.type} />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <video controls className="w-full rounded-lg">
                    <source src={state.url} type={localFile?.type} />
                    Your browser does not support the video element.
                  </video>
                )}
                <button
                  onClick={handleRemoveFile}
                  className="mt-4 py-2 px-4 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                >
                  Upload Another File
                </button>
              </div>
            )}

            {displayErrorMessage && (
              <p className="text-sm text-red-500 dark:text-red-400 text-center flex items-center justify-center">
                <AlertCircle size={16} className="mr-1" />
                {displayErrorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 