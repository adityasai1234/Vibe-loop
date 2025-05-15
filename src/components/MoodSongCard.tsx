import React from 'react';
import { SongMetadata } from '../services/firestoreService';
import { useThemeStore } from '../store/themeStore';
import { usePlayerStore } from '../store/playerStore';
import { useAudio } from '../context/AudioContext';
import { DivideCircle, KanbanSquareDashed } from 'lucide-react';

interface MoodSongCardProps {
  song: SongMetadata & { id?: string };
  mood: string;
  onPlay?: () => void;
  onAddToFavorites?: () => void;
  onRateMoodMatch?: (isMatch: boolean) => void;
}

export const MoodSongCard: React.FC<MoodSongCardProps> = ({
  song,
  mood,
  onPlay,
  onAddToFavorites,
  onRateMoodMatch
}) => {
  const { isDark } = useThemeStore();
  const { setCurrentSong, togglePlayPause, isPlaying, currentSong } = usePlayerStore();
  const { play: playAudio, pause: pauseAudio } = useAudio();
  
  const isActive = currentSong?.id === song.id;
  
  return (
    <div 
      className={`relative rounded-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}
    >
      {/* Cover Image */}
      <div className="aspect-square overflow-hidden relative group">
        <img 
          src={song.coverImageUrl} 
          alt={`${song.title} by ${song.artist}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Play Button Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            
            // Convert SongMetadata to Song format for player store
            const songForPlayer = {
              id: song.id || '',
              title: song.title,
              artist: song.artist,
              albumArt: song.coverImageUrl,
              duration: song.duration || 180, // Default duration if not provided
              audioUrl: song.audioSrc,
              genre: song.genre || '',
              releaseDate: song.releaseDate || ''
            };
            
            // Check if this is Bohemian Rhapsody
            const isBohemianRhapsody = song.title === "Bohemian Rhapsody" || song.id === "fJ9rUzIMcZQ";
            
            if (isActive) {
              if (isPlaying) {
                pauseAudio();
              } else {
                // Resume playing the current song
                const songUrl = isBohemianRhapsody
                ? "https://adityasai1234.github.io/static-site-for-vibeloop/youtube_fJ9rUzIMcZQ_audio.mp3"
                : (song.audioSrc || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${song.id}_audio.mp3`);
                playAudio(songUrl, song.title, song.artist);
              }
              togglePlayPause();
            } else {
              // Play a new song
              const songUrl = isBohemianRhapsody
                ? "https://adityasai1234.github.io/static-site-for-vibeloop/youtube_fJ9rUzIMcZQ_audio.mp3"
                : (song.audioSrc || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${song.id}_audio.mp3`);
              playAudio(songUrl, song.title, song.artist);
              setCurrentSong(songForPlayer);
            }
            
            // Still call the original onPlay if provided
            if (onPlay) onPlay();
          }}
        >
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
        </div>
        
        {/* Mood Badge */}
        <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
          {song.emoji} {mood}
        </div>
      </div>
      
      {/* Song Info */}
      <div className="p-3">
        <h3 className={`font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{song.title}</h3>
        <p className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{song.artist}</p>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{song.genre}</p>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-3">
          <button 
            onClick={onAddToFavorites}
            className={`text-sm flex items-center ${isDark ? 'text-gray-300 hover:text-primary-400' : 'text-gray-600 hover:text-primary-500'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            Save
          </button>
          
          {/* Mood Match Rating */}
          <div className="flex space-x-2">
            <button 
              onClick={() => onRateMoodMatch && onRateMoodMatch(true)}
              className="text-green-500 hover:text-green-600"
              title="This song matches the mood"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.53 5.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v5.69a.75.75 0 001.5 0v-5.69l1.72 1.72a.75.75 0 101.06-1.06l-3-3z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => onRateMoodMatch && onRateMoodMatch(false)}
              className="text-red-500 hover:text-red-600"
              title="This song doesn't match the mood"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-.53 14.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V8.25a.75.75 0 00-1.5 0v5.69l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};