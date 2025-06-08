import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Song as StoredSong } from '../store/songsStore'; // Import Song from songsStore

// Define the Song interface for the context, matching the stored song type
interface Song extends StoredSong {}

interface LikedSongsContextType {
  likedSongs: Song[];
  isLiked: (songId: string) => boolean;
  toggleLike: (song: Song) => Promise<void>;
  loading: boolean;
}

const LikedSongsContext = createContext<LikedSongsContextType | undefined>(undefined);

export function LikedSongsProvider({ children }: { children: React.ReactNode }) {
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch liked songs when user changes or component mounts
  useEffect(() => {
    if (user?.id) { // Ensure user and user.id are available
      fetchLikedSongs();
    } else {
      setLikedSongs([]);
      setLoading(false);
    }
  }, [user]);

  const fetchLikedSongs = async () => {
    if (!user?.id) { // Explicit check for user.id before fetching
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Transform the data to match our Song interface
      const songs: Song[] = data.map(item => ({
        id: item.song_id,
        title: item.title,
        artist: item.artist,
        coverUrl: item.cover_url,
        url: item.url,
        duration: item.duration,
        album: item.album,
        genre: item.genre,
        mood: item.mood || [],
        releaseDate: item.release_date,
      }));

      setLikedSongs(songs);
    } catch (error) {
      console.error('Error fetching liked songs:', error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  const isLiked = (songId: string) => {
    return likedSongs.some(song => song.id === songId);
  };

  const toggleLike = async (song: Song) => {
    if (!user?.id) return; // Explicit check for user.id before toggling

    try {
      const isCurrentlyLiked = isLiked(song.id);

      if (isCurrentlyLiked) {
        // Remove from liked songs
        const { error } = await supabase
          .from('liked_songs')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', song.id);

        if (error) throw error;

        setLikedSongs(prev => prev.filter(s => s.id !== song.id));
      } else {
        // Add to liked songs
        const { error } = await supabase
          .from('liked_songs')
          .insert({
            user_id: user.id,
            song_id: song.id,
            title: song.title,
            artist: song.artist,
            cover_url: song.coverUrl,
            url: song.url,
            duration: song.duration,
            album: song.album,
            genre: song.genre,
            mood: song.mood,
            release_date: song.releaseDate,
          });

        if (error) throw error;

        setLikedSongs(prev => [...prev, song]);
      }
    } catch (error) {
      console.error('Error toggling like:', error instanceof Error ? error.message : error);
    }
  };

  return (
    <LikedSongsContext.Provider value={{ likedSongs, isLiked, toggleLike, loading }}>
      {children}
    </LikedSongsContext.Provider>
  );
}

export function useLikedSongs() {
  const context = useContext(LikedSongsContext);
  if (context === undefined) {
    throw new Error('useLikedSongs must be used within a LikedSongsProvider');
  }
  return context;
} 