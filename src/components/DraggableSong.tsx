import React from 'react';
import { useDrag } from 'react-dnd';
import { Song } from '../store/songsStore';
import { Clock, Heart } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface DraggableSongProps {
  song: Song;
  index: number;
  isPlaying: boolean;
  isLiked: boolean;
  onPlay: () => void;
  onLike: () => void;
  formatDuration: (seconds: number) => string;
}

export const DraggableSong: React.FC<DraggableSongProps> = ({
  song,
  index,
  isPlaying,
  isLiked,
  onPlay,
  onLike,
  formatDuration,
}) => {
  const { isDark } = useThemeStore();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'SONG',
    item: { id: song.id, type: 'SONG' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: true,
  }), [song.id]);

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger onPlay if we're not dragging
    if (!isDragging) {
      onPlay();
    }
  };

  return (
    <tr
      ref={drag}
      className={`hover:${isDark ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200 cursor-move ${
        isPlaying ? (isDark ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-100 bg-opacity-50') : ''
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={handleClick}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{index + 1}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img src={song.coverUrl} alt={song.title} className="w-10 h-10 rounded-md object-cover mr-4" />
          <div className="flex flex-col">
            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-black'}`}>{song.title}</div>
            <div className="text-sm text-gray-500">{song.artist}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{song.album}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
        {formatDuration(song.duration)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className={`p-2 rounded-full ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          } ${isLiked ? 'text-red-500' : ''}`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </td>
    </tr>
  );
}; 