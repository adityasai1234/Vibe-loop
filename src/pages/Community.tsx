import React, { useState, useRef } from 'react'; // Added useRef
import BadgeCabinet from '../gamify/BadgeCabinet'; // Corrected import
import SurpriseCard from '../daily/SurpriseCard';
import HostPanel from '../sessions/HostPanel'; // Changed from named to default import
import ListenerPanel from '../sessions/ListenerPanel'; // This is correct for a default export
import { EmojiOverlay } from '../sessions/EmojiOverlay';
// import { Waveform } from '../share/Waveform'; // Assuming Waveform might be used later or remove if not
// import { SnippetExporter } from '../share/SnippetExporter'; // Assuming SnippetExporter might be used later or remove if not
import { useSessionStore } from '../store/sessionStore';
import { usePlayerStore } from '../store/playerStore';
import { useAuthContext } from '../context/AuthContext'; // Corrected path if it was '../contexts/AuthContext'
import { useBadgeStore } from '../store/badgeStore'; // Added missing import
import { motion } from 'framer-motion';
// import { Sparkles, Users, Share2, Trophy } from 'lucide-react'; // Assuming these might be used later or remove if not

type TabType = 'badges' | 'daily' | 'sessions' | 'share';

const Community: React.FC = () => {
  const { uid } = useAuthContext();
  const { currentSong } = usePlayerStore();
  const { userXP, userLevel, addXP } = useBadgeStore();
  const { currentSession, isHost } = useSessionStore();
  const [activeTab, setActiveTab] = useState<TabType>('badges');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({ progress: 0, message: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    {
      id: 'badges' as TabType,
      name: 'Badges',
      icon: '🏆',
      description: 'Your achievements and XP progress'
    },
    {
      id: 'daily' as TabType,
      name: 'Daily Card',
      icon: '🎴',
      description: 'Today\'s surprise discovery'
    },
    {
      id: 'sessions' as TabType,
      name: 'Co-Listen',
      icon: '🎧',
      description: 'Listen together with friends'
    },
    {
      id: 'share' as TabType,
      name: 'Share',
      icon: '📱',
      description: 'Create snippet videos'
    }
  ];

  const handleExportSnippet = async () => {
    if (!currentSong || !uid) return;

    setIsExporting(true);
    
    try {
      const exporter = new SnippetExporter((progress) => {
        setExportProgress(progress);
      });

      const blob = await exporter.exportSnippet({
        song: currentSong,
        startTime: 30, // Start 30 seconds into the song
        duration: 15
      });

      const shared = await SnippetExporter.shareSnippet(blob, currentSong);
      
      // Award XP for sharing
      await addXP(uid, XP_REWARDS.SHARE_SNIPPET, 'Shared a snippet');
      
      if (shared) {
        // Show success message for native sharing
        alert('Snippet shared successfully! 🎉');
      } else {
        // Show download message for fallback
        alert('Snippet saved to downloads! 📱');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export snippet. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress({ progress: 0, message: '' });
    }
  };

  if (!uid) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access community features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Community Hub
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect, discover, and share your music journey
              </p>
            </div>
            
            {/* User Stats */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Level {userLevel}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {userXP} XP
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {'U'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={containerRef}>
        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                🏆 Achievement Cabinet
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Unlock badges by exploring music, maintaining streaks, and engaging with the community.
              </p>
            </div>
            <BadgeCabinet />
          </motion.div>
        )}

        {/* Daily Card Tab */}
        {activeTab === 'daily' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                🎴 Daily Surprise
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Discover something new every day! Tips, lyrics, or fun music trivia.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <SurpriseCard />
            </div>
          </motion.div>
        )}

        {/* Co-listening Sessions Tab */}
        {activeTab === 'sessions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                🎧 Co-listening Sessions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Listen to music together with friends in real-time sync.
              </p>
            </div>
            
            {currentSession ? (
              <div className="space-y-6">
                {isHost ? (
                  <HostPanel />
                ) : (
                  <ListenerPanel sessionId={currentSession.id} />
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <HostPanel />
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">👥</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Join a Session
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Got an invite link? Paste it here to join a co-listening session.
                    </p>
                    <input
                      type="text"
                      placeholder="Paste session link here..."
                      className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-4"
                    />
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                      Join Session
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Emoji Overlay */}
            <EmojiOverlay containerRef={containerRef} />
          </motion.div>
        )}

        {/* Share Tab */}
        {activeTab === 'share' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                📱 Snippet Share
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create beautiful 15-second video snippets of your favorite songs to share on social media.
              </p>
            </div>
            
            {currentSong ? (
              <div className="space-y-6">
                {/* Current Song Preview */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Current Song
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={currentSong.albumArt} 
                      alt={currentSong.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {currentSong.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentSong.artist}
                      </p>
                    </div>
                  </div>
                  
                  {/* Waveform Preview */}
                  <Waveform
                    audioUrl={currentSong.audioSrc}
                    height={80}
                    className="mb-4"
                  />
                  
                  {/* Export Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExportSnippet}
                    disabled={isExporting}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    {isExporting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {exportProgress.message}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Create Snippet Video</span>
                        <span className="text-yellow-300">+{XP_REWARDS.SHARE_SNIPPET} XP</span>
                      </div>
                    )}
                  </motion.button>
                  
                  {isExporting && (
                    <div className="mt-4">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                          style={{ width: `${exportProgress.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                        {exportProgress.progress}% complete
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Tips */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                    💡 Sharing Tips
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>• Videos are optimized for Instagram Stories and TikTok</li>
                    <li>• 15-second clips start from the best part of the song</li>
                    <li>• Share directly to social media or save to your device</li>
                    <li>• Earn XP for your first share each day!</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                <div className="text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Song Playing
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start playing a song to create shareable snippets!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Community;
