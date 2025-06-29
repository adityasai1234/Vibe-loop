import React, { useCallback, useState } from 'react';
import { Upload, X, Music, Video, AlertCircle } from 'lucide-react';
import { useHetznerUpload } from '../hooks/useHetznerUpload';

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

interface FileUploadProps {
  className?: string;
  onUploadComplete?: (url: string) => void;
  onUploadSuccess?: (result: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  className = '', 
  onUploadComplete,
  onUploadSuccess 
}) => {
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Use Hetzner upload hook
  const { state, uploadFile, reset } = useHetznerUpload({
    onUploadComplete: (result) => {
      if (onUploadComplete) {
        onUploadComplete(result.publicUrl);
      }
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    }
  });

  const handleSelectAndUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setLocalFile(file);
    // Don't auto-upload, let user click upload button
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    setLocalFile(file);
    // Don't auto-upload, let user click upload button
  }, []);

  const handleUpload = async (file: File) => {
    try {
      // Use real Hetzner upload (both development and production)
      await uploadFile(file);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleStartUpload = useCallback(async () => {
    if (!localFile) return;
    await handleUpload(localFile);
  }, [localFile]);

  const handleRemoveFile = useCallback(() => {
    setLocalFile(null);
    reset();
    setUploadProgress(0);
  }, [reset]);

  const isAudio = localFile?.type?.startsWith('audio/');
  const isVideo = localFile?.type?.startsWith('video/');
  const displayErrorMessage = state.phase === 'error' ? state.msg : null;

  const ALL_ALLOWED_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'video/mp4', 'video/webm'];
  const MAX_FILE_SIZE_MB = 50;

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
                <div className="flex items-center space-x-2">
                  {state.phase === 'idle' && (
                    <button
                      onClick={handleStartUpload}
                      className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Upload
                    </button>
                  )}
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
              </div>
            )}
            
            {/* Upload progress */}
            {state.phase === 'uploading' && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 transition-all duration-300"
                    style={{ width: `${state.pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Uploading... {state.pct}%
                </p>
              </div>
            )}
            
            {/* Upload success */}
            {state.phase === 'done' && (
              <div className="text-center">
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                  Upload complete!
                </p>
                <button
                  onClick={handleRemoveFile}
                  className="mt-4 py-2 px-4 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                >
                  Upload Another File
                </button>
              </div>
            )}
            
            {/* Error message */}
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