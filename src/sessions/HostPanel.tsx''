import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSessionStore } from '../store/sessionStore';
import { usePlayerStore } from '../store/playerStore';
import { useAuthContext } from '../context/AuthContext';
import { useBadgeStore } from '../store/badgeStore';
import { Song } from '../types';
import { XP_REWARDS } from '../gamify/badges';

interface HostPanelProps {
  onSessionCreated?: (sessionId: string) => void;
}

const HostPanel: React.FC<HostPanelProps> = ({ onSessionCreated }) => {
  const { user } = useAuthContext();
  const { currentSong, queue } = usePlayerStore();
  const { 
    currentSession, 
    isHost, 
    isConnected, 
    participants,
    createSession, 
    leaveSession,
    addToQueue,
    removeFromQueue,
    updatePlayback
  } = useSessionStore();
  const { addXP, incrementSessionsHosted } = useBadgeStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [sessionLink, setSessionLink] = useState('');
  const [showQueueManager, setShowQueueManager] = useState(false);

  useEffect(() => {
    if (currentSession) {
      const link = `${window.location.origin}/session/${currentSession.id}`;
      setSessionLink(link);
    }
  }, [currentSession]);

  const handleCreateSession = async () => {
    if (!user) return;
    
    setIsCreating(true);
    try {
      const sessionId = await createSession(
        user.uid, 
        user.displayName || 'Anonymous',
        currentSong || undefined
      );
      
      // Award XP for hosting
      await addXP(user.uid, XP_REWARDS.HOST_SESSION, 'Started co-listening session');
      await incrementSessionsHosted(user.uid);
      
      onSessionCreated?.(sessionId);
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleLeaveSession = async () => {
    await leaveSession();
    setSessionLink('');
  };

  const copySessionLink = async () => {
    try {
      await navigator.clipboard.writeText(sessionLink);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleAddToQueue = async (song: Song) => {
    await addToQueue(song);
  };

  const handleRemoveFromQueue = async (songId: string) => {
    await removeFromQueue(songId);
  };

  if (!user) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to host co-listening sessions
        </p>
      </div>
    );
  }

  if (!isConnected || !currentSession) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🎧</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Start Co-listening Session
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Share music with friends in real-time. Everyone hears the same thing at the same time!
          </p>
          
          {currentSong && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Currently playing:
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={currentSong.albumArt} 
                  alt={currentSong.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentSong.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentSong.artist}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateSession}
            disabled={isCreating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </div>
            ) : (
              'Go Live! 🚀'
            )}
          </motion.button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-yellow-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium">+{XP_REWARDS.HOST_SESSION} XP</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Session Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            🔴 Live Session
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {participants.length} listener{participants.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLeaveSession}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          End Session
        </motion.button>
      </div>

      {/* Share Link */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Share this link with friends:
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={sessionLink}
            readOnly
            className="flex-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copySessionLink}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Copy
          </motion.button>
        </div>
      </div>

      {/* Current Song */}
      {currentSession.currentSong && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Now Playing:
          </p>
          <div className="flex items-center gap-3">
            <img 
              src={currentSession.currentSong.albumArt} 
              alt={currentSession.currentSong.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {currentSession.currentSong.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentSession.currentSong.artist}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Queue Management */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Queue ({currentSession.queue.length})
          </h4>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowQueueManager(!showQueueManager)}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            {showQueueManager ? 'Hide' : 'Manage'}
          </motion.button>
        </div>
        
        {showQueueManager && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {currentSession.queue.map((song, index) => (
              <div key={`${song.id}-${index}`} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img 
                  src={song.albumArt} 
                  alt={song.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    {song.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {song.artist}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemoveFromQueue(song.id)}
                  className="text-red-500 hover:text-red-600 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            ))}
            
            {currentSession.queue.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Queue is empty. Add songs to keep the party going! 🎵
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Participants */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">
          Listeners ({participants.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {participants.map((participant, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-900 dark:text-white">
                {participant.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HostPanel;