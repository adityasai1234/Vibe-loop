import React, { useEffect, useState } from 'react';

interface Song {
  id: number;
  url: string;
  title: string;
}

export const HomePage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('🔄 Fetching songs from backend...');
        const res = await fetch('http://localhost:5001/api/uploads');
        console.log('📡 Response status:', res.status);
        if (!res.ok) throw new Error('Failed to fetch songs');
        const data = await res.json();
        console.log('🎵 Songs received:', data);
        setSongs(data);
      } catch (err: any) {
        console.error('❌ Error fetching songs:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  console.log('🎵 Current songs state:', songs);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🎵 Uploaded Songs</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {songs.length === 0 && !loading && <p>No songs uploaded yet.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div key={song.id} className="rounded-lg overflow-hidden shadow-md p-4 bg-white dark:bg-secondary-900">
            <p className="mb-2 font-semibold truncate">{song.title}</p>
            <audio controls src={song.url} className="w-full" />
            <a href={song.url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 dark:text-blue-400 text-xs">
              Open in new tab
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}; 
