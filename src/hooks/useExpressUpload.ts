import { useState, useCallback } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UploadState {
  phase: 'idle' | 'uploading' | 'done' | 'error';
  pct: number;
  url?: string;
  msg?: string;
}

interface UploadResponse {
  message: string;
  song: {
    id: number;
    title: string;
    url: string;
  };
}

interface UseExpressUploadOptions {
  onUploadComplete?: (result: UploadResponse) => void;
}

export const useExpressUpload = (options: UseExpressUploadOptions = {}) => {
  const [state, setState] = useState<UploadState>({ phase: 'idle', pct: 0 });
  const { onUploadComplete } = options;

  const uploadFile = useCallback(async (file: File) => {
    if (!file) {
      setState({ phase: 'error', pct: 0, msg: 'No file provided' });
      return;
    }

    try {
      setState({ phase: 'uploading', pct: 0 });

      // 1. Upload to Hetzner via /api/upload-to-hetzner
      const formData = new FormData();
      formData.append('file', file);

      const hetznerRes = await fetch(`${API_BASE_URL}/api/upload-to-hetzner`, {
        method: 'POST',
        body: formData,
      });

      if (!hetznerRes.ok) {
        let errorMessage = `HTTP ${hetznerRes.status}: ${hetznerRes.statusText}`;
        try {
          const errorData = await hetznerRes.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {}
        throw new Error(errorMessage);
      }

      const hetznerData = await hetznerRes.json();
      const publicUrl = hetznerData.publicUrl;
      if (!publicUrl) {
        throw new Error('No publicUrl returned from Hetzner upload');
      }

      // 2. Send title and url to Express backend
      const title = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          url: publicUrl
        }),
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
      
      setState({ 
        phase: 'done', 
        pct: 100, 
        url: uploadData.song.url,
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
  }, [onUploadComplete]);

  const reset = useCallback(() => {
    setState({ phase: 'idle', pct: 0 });
  }, []);

  return {
    state,
    uploadFile,
    reset,
  };
}; 