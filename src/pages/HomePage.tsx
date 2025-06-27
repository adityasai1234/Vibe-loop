import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useThemeStore } from '../store/themeStore';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { supabase, getPublicUrl } from '../lib/supabaseClient';
import { Play, Pause, PlusCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { isDark } = useThemeStore();
  const { currentSong, isPlaying, play, pause, addToQueue } = useMusicPlayer();

  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('inserted_at', { ascending: false });
      if (error) {
        setError('Failed to fetch songs');
        setLoading(false);
        return;
      }
      setSongs(data || []);
      setLoading(false);
    };
    fetchSongs();
  }, []);

  const handlePlay = (song: any) => {
    play({
      id: song.id,
      title: song.file_name,
      artist: song.artist || 'Unknown Artist',
      album: song.album || 'Unknown Album',
      coverUrl: song.coverUrl || '',
      url: getPublicUrl(song.path),
      duration: song.duration || 0,
      genre: song.genre || 'Unknown',
      releaseDate: song.releaseDate || '',
      mood: song.mood || [],
    });
  };

  const handleAddToQueue = (song: any) => {
    addToQueue({
      id: song.id,
      title: song.file_name,
      artist: song.artist || 'Unknown Artist',
      album: song.album || 'Unknown Album',
      coverUrl: song.coverUrl || '',
      url: getPublicUrl(song.path),
      duration: song.duration || 0,
      genre: song.genre || 'Unknown',
      releaseDate: song.releaseDate || '',
      mood: song.mood || [],
    });
  };

  return (
    <div className={`p-8 transition-colors duration-300 ${
      isDark ? 'text-secondary-100' : 'text-secondary-900'
    }`}>
      <h1 className="text-3xl font-bold mb-4">Welcome to Vibe Loop</h1>
      <p className={`text-lg mb-8 ${
        isDark ? 'text-secondary-300' : 'text-secondary-700'
      }`}>
        Hello, {user?.email}! Start exploring music that matches your mood.
      </p>

      {loading && <div>Loading songs...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {songs.map((song) => (
          <div
            key={song.id}
            className={`group relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-105 ${
              isDark ? 'bg-secondary-900' : 'bg-white'
            }`}
          >
            <div className="aspect-square relative flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              {/* No cover art, just an icon or fallback */}
              <span className="text-6xl text-gray-400">🎵</span>
              <button
                onClick={() => handlePlay(song)}
                className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  isDark ? 'text-white' : 'text-white'
                }`}
              >
                {currentSong?.id === song.id && isPlaying ? (
                  <Pause size={48} />
                ) : (
                  <Play size={48} />
                )}
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate text-lg">{song.file_name}</h3>
              <p className={`text-sm truncate ${
                isDark ? 'text-secondary-400' : 'text-secondary-600'
              }`}>
                Uploaded: {new Date(song.inserted_at).toLocaleString()}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-secondary-800 text-secondary-300' : 'bg-secondary-100 text-secondary-600'
                }`}>
                  {song.bucket}
                </span>
                <button
                  onClick={() => handleAddToQueue(song)}
                  className={`p-1 rounded-full transition-colors duration-200 ${
                    isDark ? 'hover:bg-secondary-800' : 'hover:bg-secondary-100'
                  }`}
                  title="Add to Queue"
                >
                  <PlusCircle size={20} className={isDark ? 'text-secondary-400' : 'text-secondary-500'} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
