import React, { useState } from 'react';
import { Play, Pause, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { usePlayerStore } from '../store/playerStore';
import { useAudio } from '../context/AudioContext';
import { Song } from '../types';

interface SongDetailProps {
  song: Song;
  showYoutubeLink?: boolean;
}

// Bohemian Rhapsody song data
const bohemianRhapsody: Song = {
  id: 'bohemian-rhapsody',
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
  albumArt: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png',
  audioSrc: '/music/bohemian_rhapsody.mp3',
  duration: 354, // 5:54 in seconds
  genre: 'Rock',
  releaseDate: '1975',
  youtubeLink: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ'
};

export const SongDetail: React.FC<SongDetailProps> = ({ 
  song = bohemianRhapsody,
  showYoutubeLink = true 
}) => {
  const { isDark } = useThemeStore();
  const { currentSong, isPlaying, setCurrentSong, togglePlayPause } = usePlayerStore();
  const { play: playAudio, pause: pauseAudio } = useAudio();
  const [isLiked, setIsLiked] = useState(false);
  
  const isActive = currentSong?.id === song.id;
  
  const handlePlay = () => {
    if (isActive) {
      if (isPlaying) {
        pauseAudio();
      } else {
        // Resume playing the current song
        const songUrl = song.audioSrc || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${song.id}_audio.mp3`;
        playAudio(songUrl, song.title, song.artist);
      }
      togglePlayPause();
    } else {
      // Play a new song
      const songUrl = song.audioSrc || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${song.id}_audio.mp3`;
      playAudio(songUrl, song.title, song.artist);
      setCurrentSong(song);
    }
  };
  
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className={`song-detail-card rounded-2xl overflow-hidden ${isDark ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-900'} shadow-xl border ${isDark ? 'border-white/10' : 'border-gray-200'} backdrop-blur-md`}>
      <div className="flex flex-col md:flex-row">
        {/* Album Art */}
        <div className="relative md:w-2/5 aspect-square overflow-hidden">
          <img 
            src={song.albumArt} 
            alt={`${song.title} by ${song.artist}`}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 md:hidden">
            <h2 className="text-white text-2xl font-bold">{song.title}</h2>
          </div>
        </div>
        
        {/* Song Details */}
        <div className="p-6 md:w-3/5 flex flex-col justify-between">
          <div>
            <div className="hidden md:block">
              <h2 className="text-3xl font-bold mb-2">{song.title}</h2>
              <p className="text-xl opacity-80 mb-4">{song.artist}</p>
            </div>
            <div className="md:hidden">
              <p className="text-xl opacity-80 mb-4">{song.artist}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 mb-6">
              <div>
                <p className="text-sm opacity-70">Genre</p>
                <p className="font-medium">{song.genre}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Release Year</p>
                <p className="font-medium">{song.releaseDate}</p>
              </div>
              <div>
                <p className="text-sm opacity-70">Duration</p>
                <p className="font-medium">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            {/* Player Controls */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={handlePlay}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center rounded-full w-14 h-14 ${isDark ? 'bg-primary-500 hover:bg-primary-600' : 'bg-primary-500 hover:bg-primary-600'} text-white shadow-lg`}
              >
                {isActive && isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </motion.button>
              
              <motion.button
                onClick={toggleLike}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center rounded-full w-12 h-12 ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <Heart 
                  size={20} 
                  fill={isLiked ? 'currentColor' : 'none'} 
                  className={isLiked ? 'text-accent-500' : ''}
                />
              </motion.button>
              
              {showYoutubeLink && song.youtubeLink && (
                <a 
                  href={song.youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
                >
                  <ExternalLink size={16} />
                  <span>Watch on YouTube</span>
                </a>
              )}
            </div>
            
            {/* Audio Player (Fallback) */}
            <div className="w-full">
              <audio controls className="w-full">
                <source src={song.audioSrc} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetail;
