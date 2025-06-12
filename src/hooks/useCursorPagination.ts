import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/supabase';

type MediaFile = Database['public']['Tables']['media_files']['Row'];

interface Cursor {
  inserted_at: string;
  id: string;
}

interface UseCursorPaginationOptions {
  pageSize: number;
  ownerId?: string;
  initialCursor?: Cursor | null;
  onError?: (error: Error) => void;
}

interface UseCursorPaginationReturn {
  items: MediaFile[];
  nextCursor: Cursor | null;
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export function useCursorPagination({
  pageSize,
  ownerId,
  initialCursor = null,
  onError,
}: UseCursorPaginationOptions): UseCursorPaginationReturn {
  const [items, setItems] = useState<MediaFile[]>([]);
  const [nextCursor, setNextCursor] = useState<Cursor | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async (cursor: Cursor | null) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc(
        'get_paginated_media_files',
        {
          _page_size: pageSize,
          _cursor_inserted_at: cursor?.inserted_at || null,
          _cursor_id: cursor?.id || null,
          _owner_id: ownerId || null,
        }
      );

      if (rpcError) throw rpcError;

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format from database');
      }

      const [items, nextCursor] = data;
      
      // Update state
      setItems(prev => cursor ? [...prev, ...items] : items);
      setNextCursor(nextCursor);
      setHasMore(!!nextCursor);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch items');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, ownerId, onError]);

  // Load initial page
  useEffect(() => {
    fetchPage(initialCursor);
  }, [fetchPage, initialCursor]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading) return;
    await fetchPage(nextCursor);
  }, [nextCursor, loading, fetchPage]);

  const reset = useCallback(() => {
    setItems([]);
    setNextCursor(initialCursor);
    setError(null);
    setHasMore(true);
    fetchPage(initialCursor);
  }, [initialCursor, fetchPage]);

  return {
    items,
    nextCursor,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
} 