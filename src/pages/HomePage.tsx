import React, { useEffect, useState } from 'react';
import { eventEmitter, EVENTS } from '../lib/events';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Song {
  id: number;
  url: string;
  title: string;
}

export const HomePage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching songs from backend...');
      console.log('🌐 Fetch URL:', `${API_BASE_URL}/api/uploads`);
      
      const res = await fetch(`${API_BASE_URL}/api/uploads`);
      console.log('📡 Response status:', res.status);
      console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Response not OK:', errorText);
        throw new Error(`Failed to fetch songs: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('🎵 Songs received:', data);
      console.log('🎵 Number of songs:', data.length);
      console.log('🎵 Songs array type:', Array.isArray(data) ? 'Array' : typeof data);
      
      setSongs(data);
      console.log('✅ Songs state updated');
    } catch (err: any) {
      console.error('❌ Error fetching songs:', err);
      console.error('❌ Error details:', err.message);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
      console.log('🏁 Loading finished');
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Listen for file upload events to refresh the songs list
  useEffect(() => {
    const handleFileUploaded = () => {
      console.log('📡 File upload event received, refreshing songs...');
      fetchSongs();
    };

    eventEmitter.on(EVENTS.FILE_UPLOADED, handleFileUploaded);

    return () => {
      eventEmitter.off(EVENTS.FILE_UPLOADED, handleFileUploaded);
    };
  }, []);

  console.log('🎵 Current songs state:', songs);
  console.log('🎵 Songs length:', songs.length);
  console.log('🎵 Loading state:', loading);
  console.log('🎵 Error state:', error);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🎵 Uploaded Songs</h1>
      {loading && <p className="text-blue-600">Loading songs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {songs.length === 0 && !loading && <p className="text-gray-600">No songs uploaded yet.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div key={song.id} className="rounded-lg overflow-hidden shadow-md p-4 bg-white dark:bg-secondary-900 border">
            <h3 className="mb-2 font-semibold truncate text-lg">{song.title}</h3>
            <p className="text-xs text-gray-500 mb-2">ID: {song.id}</p>
            <p className="text-xs text-gray-500 mb-2 break-all">URL: {song.url}</p>
            <audio controls src={song.url} className="w-full mb-2" />
            <a 
              href={song.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block mt-2 text-blue-600 dark:text-blue-400 text-xs hover:underline"
            >
              Open in new tab
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}; 
