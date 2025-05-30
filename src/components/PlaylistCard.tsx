import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Playlist } from '../types/components';
import { usePlayerStore } from '../store/playerStore';
import { useAudio } from '../context/AudioContext';
import { songs } from '../data/songs';

interface PlaylistCardProps {
  playlist: Playlist;
  mood?: string;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, mood }) => {
  const { setCurrentSong, togglePlayPause, isPlaying, currentSong } = usePlayerStore();
  const { play: playAudio, pause: pauseAudio } = useAudio();

  const moodColor = {
    happy: 'bg-pink-500/10',
    sad: 'bg-blue-500/10',
    energetic: 'bg-green-500/10',
    calm: 'bg-purple-500/10'
  }[mood || 'calm'];

  const playlistSongs = playlist.songs.map(id => songs.find(song => song.id === id.toString())).filter(Boolean);
  const firstSong = playlistSongs[0];
  const isPlaylistPlaying = isPlaying && currentSong && playlist.songs.includes(currentSong.id.toString());

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaylistPlaying) {
      pauseAudio();
      togglePlayPause();
    } else if (firstSong) {
      // Play the first song in the playlist
      const songUrl = firstSong.audioSrc || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${firstSong.id}_audio.mp3`;
      playAudio(songUrl, firstSong.title, firstSong.artist);
      setCurrentSong(firstSong);
    }
  };

  return (
    <div className="group relative">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <div className={`absolute inset-0 ${moodColor} mix-blend-multiply`} />
        <img
          src={playlist.coverArt}
          alt={playlist.title}
          className="object-cover object-center group-hover:opacity-75"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <button 
            onClick={handlePlay}
            className="rounded-full bg-white/90 p-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {isPlaylistPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </div>
      <h3 className="mt-4 text-sm text-gray-700 group-hover:text-primary-600">
        {playlist.title}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{playlistSongs.length} songs</p>
      <p className="mt-1 text-xs text-gray-500">{playlist.likes} likes</p>
    </div>
  );
};
