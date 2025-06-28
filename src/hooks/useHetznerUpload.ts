import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface UploadState {
  phase: 'idle' | 'uploading' | 'done' | 'error';
  pct: number;
  url?: string;
  msg?: string;
}

interface UploadResponse {
  fileKey: string;
  uploadUrl: string;
  readUrl: string;
  publicUrl: string;
}

interface UseHetznerUploadOptions {
  onUploadComplete?: (result: UploadResponse) => void;
}

export const useHetznerUpload = (options: UseHetznerUploadOptions = {}) => {
  const [state, setState] = useState<UploadState>({ phase: 'idle', pct: 0 });
  const { user } = useAuth();
  const { onUploadComplete } = options;

  const uploadFile = useCallback(async (file: File) => {
    if (!file) {
      setState({ phase: 'error', pct: 0, msg: 'No file provided' });
      return;
    }

    try {
      setState({ phase: 'uploading', pct: 0 });

      // Send file as FormData
      const formData = new FormData();
      formData.append('file', file);
      if (user?.id) formData.append('userId', user.id);

      const response = await fetch('/api/upload-to-hetzner', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {}
        throw new Error(errorMessage);
      }

      const uploadData = await response.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      setState({ 
        phase: 'done', 
        pct: 100, 
        url: uploadData.publicUrl,
        msg: 'Upload successful!'
      });

      if (onUploadComplete) {
        onUploadComplete(uploadData);
      }

      return uploadData;

    } catch (error) {
      setState({ 
        phase: 'error', 
        pct: 0, 
        msg: error instanceof Error ? error.message : 'Upload failed' 
      });
      throw error;
    }
  }, [user?.id, onUploadComplete]);

  const reset = useCallback(() => {
    setState({ phase: 'idle', pct: 0 });
  }, []);

  return {
    state,
    uploadFile,
    reset,
  };
}; 