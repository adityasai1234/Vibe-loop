import React from 'react';
import { useDrop } from 'react-dnd';
import { usePlaylistStore } from '../store/playlistStore';
import { useThemeStore } from '../store/themeStore';
import { DraggableSong } from './DraggableSong';
import { Song } from '../store/songsStore';

interface DroppablePlaylistProps {
  playlistId: string;
  songs: Song[];
  currentSongId: string | null;
  isPlaying: boolean;
  likedSongs: string[];
  onSongPlay: (song: Song) => void;
  onSongLike: (songId: string) => void;
  formatDuration: (seconds: number) => string;
}

export const DroppablePlaylist: React.FC<DroppablePlaylistProps> = ({
  playlistId,
  songs,
  currentSongId,
  isPlaying,
  likedSongs,
  onSongPlay,
  onSongLike,
  formatDuration,
}) => {
  const { isDark } = useThemeStore();
  const { moveSongBetweenPlaylists, playlists } = usePlaylistStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'SONG',
    drop: (item: { id: string; type: string }) => {
      // Find the source playlist that contains this song
      const sourcePlaylist = playlists.find(playlist => 
        playlist.songs.includes(item.id)
      );

      // Only move if we found a source playlist and it's different from the target
      if (sourcePlaylist && sourcePlaylist.id !== playlistId) {
        moveSongBetweenPlaylists(item.id, sourcePlaylist.id, playlistId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }), [playlistId, playlists, moveSongBetweenPlaylists]);

  return (
    <div
      ref={drop}
      className={`overflow-x-auto rounded-lg shadow-md ${
        isDark ? 'bg-gray-800' : 'bg-white'
      } ${isOver ? 'ring-2 ring-primary-500' : ''}`}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Album</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Duration</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {songs.map((song, index) => (
            <DraggableSong
              key={song.id}
              song={song}
              index={index}
              isPlaying={currentSongId === song.id && isPlaying}
              isLiked={likedSongs.includes(song.id)}
              onPlay={() => onSongPlay(song)}
              onLike={() => onSongLike(song.id)}
              formatDuration={formatDuration}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}; 