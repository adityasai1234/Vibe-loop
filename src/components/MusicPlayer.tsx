import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Repeat, Shuffle, Heart, ListMusic, Maximize2, Minimize2 
} from 'lucide-react';
import { usePlayerStore } from '../store/playerStore';
import { useAudio } from '../context/AudioContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebaseConfig';
import { PlayerControls } from './PlayerControls';
import '../styles/playerResponsive.css'; // Import responsive fixes for player

export const MusicPlayer: React.FC = () => {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    togglePlayPause, 
    nextSong, 
    prevSong, 
    setVolume,
    playbackProgress,
    setPlaybackProgress
  } = usePlayerStore();
  
  // Use AudioContext for actual audio playback
  const { play: playAudio, pause: pauseAudio, isPlaying: isAudioPlaying } = useAudio();
  
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Simulate playback progress
  // Sync AudioContext state with player store state
  useEffect(() => {
    // If AudioContext is playing but player store says it's not, sync them
    if (isAudioPlaying !== isPlaying) {
      if (isAudioPlaying) {
        togglePlayPause(); // Set player store to playing
      }
    }
  }, [isAudioPlaying, isPlaying, togglePlayPause]);

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying && currentSong) {
      intervalRef.current = window.setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            nextSong();
            return 0;
          }
          return prev + (100 / (currentSong.duration)) * 0.1;
        });
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentSong, nextSong, setPlaybackProgress]);
  
  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !currentSong) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setPlaybackProgress(percent * 100);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const currentTime = currentSong 
    ? formatTime((currentSong.duration * playbackProgress) / 100) 
    : '0:00';
  
  const totalTime = currentSong ? formatTime(currentSong.duration) : '0:00';
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.7);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  const toggleRepeat = () => setRepeat(!repeat);
  const toggleShuffle = () => setShuffle(!shuffle);
  const toggleLike = () => setLiked(!liked);
  const toggleExpand = () => setExpanded(!expanded);
  
  const VolumeIcon = isMuted ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  
  if (!currentSong) {
    return null;
  } 
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg text-white border-t border-white/10 z-50 transition-all duration-300 ${expanded ? 'h-96' : ''} music-player-container`}>
      {expanded && (
        <div className="pt-6 px-8 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-6">
            <img 
              src={currentSong.albumArt} 
              alt={currentSong.title} 
              className="w-48 h-48 rounded-lg shadow-lg"
            />
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">{currentSong.title}</h2>
              <p className="text-gray-400">{currentSong.artist}</p>
              <p className="text-sm text-gray-500 mt-2">{currentSong.genre} • {currentSong.releaseDate}</p>
              <div className="flex items-center mt-4 space-x-4">
                <button 
                  onClick={toggleLike} 
                  className={`rounded-full p-2 ${liked ? 'text-accent-500 hover:text-accent-600' : 'text-white hover:text-gray-200'}`}
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button className="text-white hover:text-gray-200 rounded-full p-2">
                  <ListMusic size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="self-start">
            <button onClick={toggleExpand} className="text-white hover:text-gray-200 p-2">
              <Minimize2 size={20} />
            </button>
          </div>
        </div>
      )}
      
      <div className={`relative flex items-center px-4 ${expanded ? 'mt-6' : 'h-full'} player-container`}>
        {/* Left section - Song info */}
        <div className="flex items-center space-x-4 flex-shrink-0 song-info-container">
          {!expanded && (
            <>
              <img 
                src={currentSong.albumArt} 
                alt={currentSong.title} 
                className="w-12 h-12 rounded"
              />
              <div className="flex flex-col song-info">
                <p className="font-medium truncate">{currentSong.title}</p>
                <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
              </div>
              <button 
                onClick={toggleLike} 
                className={`p-1 ${liked ? 'text-accent-500' : 'text-gray-400'} control-button`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </>
          )}
        </div>
        
        {/* Center section - Player controls - Absolutely positioned to center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center player-controls-container">
          <div className="flex items-center space-x-4 mb-1 player-controls">
            <button 
              onClick={toggleShuffle} 
              className={`p-1 ${shuffle ? 'text-primary-500' : 'text-gray-400'} hover:text-white transition-colors control-button`}
            >
              <Shuffle size={20} />
            </button>
            <button 
              onClick={prevSong} 
              className="p-2 text-white hover:text-gray-200 transition-colors control-button"
            >
              <SkipBack size={20} />
            </button>
            <button 
              onClick={() => {
                // Toggle play/pause using AudioContext
                if (isPlaying) {
                  pauseAudio();
                } else if (currentSong) {
                  // Use the song's audioSrc or construct URL from ID
    const songUrl = currentSong.audioSrc || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${currentSong.id}_audio.mp3`;
                  playAudio(songUrl, currentSong.title, currentSong.artist);
                }
                // Also update the player store state
                togglePlayPause();
              }}
              className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-colors control-button"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            <button 
              onClick={nextSong} 
              className="p-2 text-white hover:text-gray-200 transition-colors control-button"
            >
              <SkipForward size={20} />
            </button>
            <button 
              onClick={toggleRepeat} 
              className={`p-1 ${repeat ? 'text-primary-500' : 'text-gray-400'} hover:text-white transition-colors control-button`}
            >
              <Repeat size={20} />
          </button>
          </div>
          
          <div className="w-full max-w-md flex items-center space-x-2 progress-container player-progress">
          {/* Replace with our new PlayerControls component */}
          <PlayerControls minimal={!expanded} />
        </div>
        </div>
        
        {/* Right section - Volume controls */}
        <div className="ml-auto flex items-center justify-end space-x-3 flex-shrink-0 volume-controls">
          <button onClick={toggleMute} className="text-gray-400 hover:text-white volume-button control-button">
            <VolumeIcon size={20} />
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 accent-primary-500 volume-slider"
          />
          {!expanded && (
            <button onClick={toggleExpand} className="text-gray-400 hover:text-white ml-2 control-button">
              <Maximize2 size={20} />
            </button>
          )}
        </div>
      </div>
      <div className="player-container fixed-center">
        <div className="player-controls absolute-center">
          <button 
            onClick={toggleShuffle}
            className={`control-button ${shuffle ? 'text-primary-400' : 'text-gray-400'}`}
          >
            <Shuffle size={20} />
          </button>
          <button className="control-button">
            <SkipBack size={24} />
          </button>
          <button 
            className="play-button"
            onClick={() => {
              // Toggle play/pause using AudioContext
              if (isPlaying) {
                pauseAudio();
              } else if (currentSong) {
                // Use the song's audioSrc or construct URL from ID
    const songUrl = currentSong.audioSrc || `https://adityasai1234.github.io/static-site-for-vibeloop/youtube_${currentSong.id}_audio.mp3`;
                playAudio(songUrl, currentSong.title, currentSong.artist);
              }
              // Also update the player store state
              togglePlayPause();
            }}
          >
            {isPlaying ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" />
            )}
          </button>
          <button className="control-button">
            <SkipForward size={24} />
          </button>
          <button 
            onClick={toggleRepeat}
            className={`control-button ${repeat ? 'text-primary-400' : 'text-gray-400'}`}
          >
            <Repeat size={20} />
          </button>
        </div>
      </div>
      </div>
  );
};
export default MusicPlayer;
if (typeof window !== 'undefined') {
  const auth = getAuth(app);
  onAuthStateChanged(auth, (user) => { });
}
// identifiers: ["adityasai1234.github.io/static-site-for-vibeloop/youtube_<song_id>_audio.mp3"]
