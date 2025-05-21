import React, { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { usePlayerStore } from '../store/playerStore';
import { useAudio } from '../context/AudioContext';
import { songs } from '../data/songs';
import { Song } from '../types';

interface MoodShuffleProps {
  onSongSelected?: (song: Song) => void;
}

// Define available moods based on the songs data
const availableMoods = [
  { name: 'Happy', emoji: '😊' },
  { name: 'Chill', emoji: '😌' },
  { name: 'Energetic', emoji: '⚡' },
  { name: 'Hype', emoji: '🔥' },
  { name: 'Angry', emoji: '😠' },
  { name: 'Reflective', emoji: '🤔' },
  { name: 'Uplifting', emoji: '🙌' }
];

export const MoodShuffle: React.FC<MoodShuffleProps> = ({ onSongSelected }) => {
  const { isDark } = useThemeStore();
  const { setCurrentSong } = usePlayerStore();
  const { play: playAudio } = useAudio();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [noSongsFound, setNoSongsFound] = useState(false);

  const shuffleByMood = (mood: string) => {
    // Filter songs that match the selected mood
    const filteredSongs = songs.filter(song => song.mood && song.mood.includes(mood));
    
    if (filteredSongs.length === 0) {
      setNoSongsFound(true);
      setSelectedSong(null);
      return;
    }
    
    setNoSongsFound(false);
    
    // Select a random song from the filtered list
    const randomSong = filteredSongs[Math.floor(Math.random() * filteredSongs.length)];
    
    // Update the selected song state
    setSelectedSong(randomSong);
    
    // Play the selected song
    playSong(randomSong);
    
    // Notify parent component if callback is provided
    if (onSongSelected) {
      onSongSelected(randomSong);
    }
  };

  const playSong = (song: Song) => {
    // Update the player store
    setCurrentSong(song);
    
    // Play the audio
    const songUrl = song.audioSrc || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${song.id}_audio.mp3`;
    playAudio(songUrl, song.title, song.artist);
  };

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>🎵 Mood Shuffle</h2>
      </div>
      
      {/* Mood Buttons */}
      <div className="flex flex-wrap gap-2 mb-6" id="mood-buttons">
        {availableMoods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => shuffleByMood(mood.name)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 transform hover:-translate-y-1 flex items-center
              ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-gray-100 text-gray-900'}
              shadow-md hover:shadow-lg`}
          >
            <span className="mr-2">{mood.emoji}</span>
            {mood.name}
          </button>
        ))}
      </div>
      
      {/* Now Playing Section */}
      {selectedSong && (
        <div className={`p-4 rounded-lg transition-all duration-300 ${isDark ? 'bg-gray-800/50' : 'bg-white'} shadow-md`}>
          <div className="flex items-center">
            <img 
              src={selectedSong.albumArt} 
              alt={`${selectedSong.title} by ${selectedSong.artist}`} 
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div>
              <h3 className="font-bold">Now Playing:</h3>
              <p className="font-medium">{selectedSong.title}</p>
              <p className="text-sm opacity-80">{selectedSong.artist}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* No Songs Found Message */}
      {noSongsFound && (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-700'}`}>
          No songs found for this mood. Try another mood.
        </div>
      )}
    </div>
  );
};

export default MoodShuffle;
