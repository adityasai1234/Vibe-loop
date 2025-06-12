import { useState, useCallback } from 'react';
import { supabase, getPublicUrl, validateFileSize } from '../lib/supabaseClient';
import type { StorageError } from '@supabase/storage-js';

interface UseFileUploadOptions {
  bucket?: string;
  onSuccess?: (url: string, filePath: string) => void;
  onError?: (error: Error) => void;
}

interface UploadProgress {
  loaded: number;
  total: number;
}

interface UseFileUploadReturn {
  file: File | null;
  setFile: (file: File | null) => void;
  upload: () => Promise<void>;
  progress: number;
  url: string | null;
  error: Error | null;
  uploading: boolean;
}

export const useFileUpload = ({
  bucket = 'media',
  onSuccess,
  onError,
}: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async () => {
    if (!file) {
      setError(new Error('No file selected'));
      return;
    }

    try {
      // 1. Validate file size
      validateFileSize(file);

      // 2. Check authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('No active session');

      console.log('Auth check:', {
        hasSession: !!session,
        tokenExpiry: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
        isExpired: session.expires_at ? new Date(session.expires_at * 1000) < new Date() : false,
      });

      setUploading(true);
      setError(null);
      setProgress(0);

      // 3. Generate safe filename
      const timestamp = Date.now();
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${timestamp}_${safeFileName}`; // No bucket prefix needed

      console.log('Upload attempt:', {
        bucket,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        fileName: file.name,
      });

      // 4. Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', {
          message: uploadError.message,
          name: uploadError.name,
          error: uploadError,
        });
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // 5. Store metadata via RPC
      const { error: rpcError } = await supabase.rpc('add_media_file', {
        _bucket: bucket,
        _path: uploadData.path,
        _file_name: file.name
      });

      if (rpcError) {
        console.error('RPC error:', rpcError);
        throw rpcError;
      }

      // 6. Get public URL
      const publicUrl = getPublicUrl(filePath);
      console.log('Public URL:', publicUrl);
      
      setUrl(publicUrl);
      onSuccess?.(publicUrl, filePath);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      console.error('Upload failed:', {
        error,
        file: file ? {
          name: file.name,
          size: file.size,
          type: file.type,
        } : null,
      });
      setError(error);
      onError?.(error);
    } finally {
      setUploading(false);
    }
  }, [file, bucket, onSuccess, onError]);

  return {
    file,
    setFile,
    upload,
    progress,
    url,
    error,
    uploading,
  };
}; 