import React from 'react';
import { Play, Heart, Pause, Joystick } from 'lucide-react';
import { Playlist } from '../types';
import { usePlayerStore } from '../store/playerStore';
import { songs } from '../data/songs';

interface PlaylistCardProps {
  playlist: Playlist;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const { setCurrentSong, togglePlayPause, isPlaying, currentSong } = usePlayerStore();
  
  const playlistSongs = songs.filter(song => playlist.songs.includes(song.id));
  const firstSong = playlistSongs[0];
  const isPlaylistPlaying = isPlaying && currentSong && playlist.songs.includes(currentSong.id);
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaylistPlaying) {
      togglePlayPause();
    } else if (firstSong) {
      setCurrentSong(firstSong);
    }
  };

  return (
    <div className="flex flex-col w-48 p-3 group rounded-lg transition-all hover:bg-gray-100/5">
      <div className="relative">
        <img 
          src={playlist.coverArt} 
          alt={playlist.title} 
          className="w-full aspect-square rounded-md mb-3 object-cover transition-all group-hover:shadow-lg group-hover:shadow-primary-500/20"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-black/40 rounded-md"></div>
          <button 
            onClick={handlePlay}
            className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all transform hover:scale-105"
          >
            {isPlaylistPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>
      <div className="flex flex-col mt-2">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">{playlist.title}</p>
          <Heart size={16} className="text-gray-400 hover:text-accent-500 cursor-pointer" />
        </div>
        <p className="text-sm text-gray-400">{playlistSongs.length} songs</p>
        <p className="text-xs text-gray-500 mt-1">{playlist.likes} likes</p>
      </div>
    </div>
  );
};