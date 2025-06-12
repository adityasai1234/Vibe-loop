import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, Music, Video, AlertCircle } from 'lucide-react';
import { useFileUpload } from '../hooks/useFileUpload';
import { MAX_FILE_SIZE } from '../lib/supabaseClient';

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
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  acceptedFileTypes = ['audio/mpeg', 'audio/mp3', 'video/mp4'],
  maxFileSize = MAX_FILE_SIZE,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    file,
    setFile,
    upload,
    progress,
    url,
    error,
    uploading,
  } = useFileUpload({
    onSuccess: async (publicUrl, filePath) => {
      if (!file) return;
      onUploadComplete?.(publicUrl, filePath);
    },
  });

  const validateAndSetFile = useCallback((newFile: File | null) => {
    setValidationError(null);
    
    if (!newFile) {
      setFile(null);
      return;
    }

    // Validate file type
    const isValidType = acceptedFileTypes.includes(newFile.type);
    
    if (!isValidType) {
      setValidationError(`File type not supported. Please upload ${acceptedFileTypes
        .map(type => type.split('/')[1].toUpperCase())
        .join(' or ')} files.`);
      return;
    }

    // Validate file size
    if (newFile.size > maxFileSize) {
      setValidationError(`File size exceeds ${formatFileSize(maxFileSize)} limit.`);
      return;
    }

    setFile(newFile);
  }, [setFile, acceptedFileTypes, maxFileSize]);

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
      validateAndSetFile(droppedFile);
    }
  }, [validateAndSetFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  }, [validateAndSetFile]);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setValidationError(null);
  }, [setFile]);

  const isAudio = file?.type.startsWith('audio/');
  const isVideo = file?.type.startsWith('video/');
  const errorMessage = validationError || error?.message;

  return (
    <div className={`w-full max-w-xl mx-auto ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6
          ${isDragging ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20' : 'border-gray-300 dark:border-gray-700'}
          ${errorMessage ? 'border-red-500 dark:border-red-400' : ''}
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        
        {!file ? (
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
              Supported formats: {acceptedFileTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} (max {formatFileSize(maxFileSize)})
            </p>
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isAudio ? (
                  <Music className="w-8 h-8 text-accent-500" />
                ) : (
                  <Video className="w-8 h-8 text-accent-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Uploading... {Math.round(progress)}%
                </p>
              </div>
            )}

            {!uploading && !url && (
              <button
                onClick={upload}
                disabled={!!validationError}
                className={`
                  w-full py-2 px-4 rounded-lg font-medium
                  transition-colors duration-200
                  ${validationError
                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-accent-500 hover:bg-accent-600 text-white'
                  }
                `}
              >
                Upload File
              </button>
            )}

            {url && (
              <div className="text-center">
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                  Upload complete!
                </p>
                {isAudio ? (
                  <audio controls className="w-full">
                    <source src={url} type={file.type} />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <video controls className="w-full rounded-lg">
                    <source src={url} type={file.type} />
                    Your browser does not support the video element.
                  </video>
                )}
              </div>
            )}

            {errorMessage && (
              <p className="text-sm text-red-500 dark:text-red-400 text-center">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 