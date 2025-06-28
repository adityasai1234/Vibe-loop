import { useState, useEffect, useCallback } from 'react';

interface HetznerFile {
  key: string;
  fileName: string;
  fileExtension: string;
  size: number;
  lastModified?: Date;
  publicUrl: string;
  isAudio: boolean;
  isVideo: boolean;
  contentType: 'audio' | 'video' | 'unknown';
}

interface UseHetznerFilesOptions {
  prefix?: string;
  limit?: number;
  autoFetch?: boolean;
}

interface UseHetznerFilesReturn {
  files: HetznerFile[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalCount: number;
}

export const useHetznerFiles = (options: UseHetznerFilesOptions = {}): UseHetznerFilesReturn => {
  const { prefix = '', limit = 50, autoFetch = true } = options;
  const [files, setFiles] = useState<HetznerFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        prefix,
        limit: limit.toString(),
      });
      const response = await fetch(`/api/list-hetzner-files?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch files');
      }
      const filesWithDates = data.files.map((file: any) => ({
        ...file,
        lastModified: file.lastModified ? new Date(file.lastModified) : undefined,
      }));
      setFiles(filesWithDates);
      setTotalCount(data.totalCount);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
      setLoading(false);
    }
  }, [prefix, limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchFiles();
    }
  }, [fetchFiles, autoFetch]);

  return {
    files,
    loading,
    error,
    refetch: fetchFiles,
    totalCount,
  };
};