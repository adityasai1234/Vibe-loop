import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSessionStore } from '../store/sessionStore';
import { usePlayerStore } from '../store/playerStore';
import { useAuthContext } from '../context/AuthContext';
import { useBadgeStore } from '../store/badgeStore';
import { XP_REWARDS } from '../gamify/badges';

interface ListenerPanelProps {
  sessionId?: string;
}

const ListenerPanel: React.FC<ListenerPanelProps> = ({ sessionId }) => {
  const { user } = useAuthContext();
  const { setCurrentSong, setIsPlaying } = usePlayerStore();
  const { 
    currentSession, 
    isConnected, 
    participants,
    chatMessages,
    joinSession, 
    leaveSession,
    sendChatMessage,
    sendEmoji,
    syncWithHost
  } = useSessionStore();
  const { addXP } = useBadgeStore();
  
  const [isJoining, setIsJoining] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  useEffect(() => {
    if (sessionId && user && !isConnected) {
      handleJoinSession();
    }
  }, [sessionId, user]);

  useEffect(() => {
    // Sync playback with host
    if (currentSession && !currentSession.hostUid === user?.uid) {
      if (currentSession.currentSong) {
        setCurrentSong(currentSession.currentSong);
      }
      setIsPlaying(currentSession.isPlaying);
      
      // Sync audio time
      const audioElement = document.querySelector('audio') as HTMLAudioElement;
      if (audioElement && Math.abs(audioElement.currentTime - currentSession.seekPos) > 0.5) {
        audioElement.currentTime = currentSession.seekPos;
      }
    }
  }, [currentSession]);

  const handleJoinSession = async () => {
    if (!user || !sessionId) return;
    
    setIsJoining(true);
    setConnectionStatus('connecting');
    
    try {
      const success = await joinSession(
        sessionId, 
        user.uid, 
        user.displayName || 'Anonymous'
      );
      
      if (success) {
        setConnectionStatus('connected');
        // Award XP for joining
        await addXP(user.uid, XP_REWARDS.JOIN_SESSION, 'Joined co-listening session');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Failed to join session:', error);
      setConnectionStatus('disconnected');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveSession = async () => {
    await leaveSession();
    setConnectionStatus('disconnected');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    await sendChatMessage(chatInput);
    setChatInput('');
  };

  const handleSendEmoji = async (emoji: string) => {
    await sendEmoji(emoji);
  };

  const quickEmojis = ['❤️', '🔥', '🎉', '👏', '😍', '🤩', '💯', '🎵'];

  if (!user) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to join co-listening sessions
        </p>
      </div>
    );
  }

  if (connectionStatus === 'disconnected' && sessionId) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🎧</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Join Co-listening Session
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've been invited to listen to music together!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoinSession}
            disabled={isJoining}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Joining...
              </div>
            ) : (
              'Join Session 🚀'
            )}
          </motion.button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-yellow-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium">+{XP_REWARDS.JOIN_SESSION} XP</span>
          </div>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'connecting') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Connecting...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Syncing with the host
          </p>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">😔</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            Session Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This session may have ended or doesn't exist.
          </p>
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
            🔴 Listening with {currentSession.hostName}
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
          Leave
        </motion.button>
      </div>

      {/* Sync Status */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            Synced with host
          </span>
        </div>
      </div>

      {/* Current Song */}
      {currentSession.currentSong && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
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

      {/* Quick Emoji Reactions */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Quick Reactions:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickEmojis.map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSendEmoji(emoji)}
              className="text-2xl p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Toggle */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowChat(!showChat)}
          className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          {showChat ? 'Hide Chat' : 'Show Chat'} 💬
        </motion.button>
        
        {showChat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            {/* Chat Messages */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-40 overflow-y-auto mb-4">
              {chatMessages.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  No messages yet. Start the conversation! 👋
                </p>
              ) : (
                <div className="space-y-2">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="text-sm">
                      {message.emoji ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {message.userName}:
                          </span>
                          <span className="text-2xl">{message.emoji}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {message.userName}:
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 ml-2">
                            {message.text}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!chatInput.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Send
              </motion.button>
            </form>
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
                {participant.uid === currentSession.hostUid && ' (Host)'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListenerPanel;