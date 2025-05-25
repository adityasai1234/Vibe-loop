import { onDocumentWritten, onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

interface SessionData {
  id: string;
  hostUid: string;
  hostName: string;
  isPlaying: boolean;
  currentSong?: any;
  seekPos: number;
  queue: string[];
  participants: Array<{
    uid: string;
    name: string;
    joinedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface ChatMessage {
  id: string;
  uid: string;
  userName: string;
  text?: string;
  emoji?: string;
  sentAt: Date;
}

// Function to broadcast session updates to all participants
export const broadcastSessionUpdate = onDocumentWritten(
  'sessions/{sessionId}',
  async (event) => {
    try {
      const sessionId = event.params.sessionId;
      const beforeData = event.data?.before?.data() as SessionData | undefined;
      const afterData = event.data?.after?.data() as SessionData | undefined;

      // If session was deleted, clean up
      if (!afterData) {
        logger.info(`Session ${sessionId} was deleted, cleaning up...`);
        await cleanupSession(sessionId);
        return;
      }

      // If this is a new session, initialize it
      if (!beforeData) {
        logger.info(`New session created: ${sessionId}`);
        await initializeSession(sessionId, afterData);
        return;
      }

      // Check if important playback state changed
      const playbackChanged = 
        beforeData.isPlaying !== afterData.isPlaying ||
        beforeData.seekPos !== afterData.seekPos ||
        beforeData.currentSong?.id !== afterData.currentSong?.id;

      if (playbackChanged) {
        logger.info(`Broadcasting playback update for session ${sessionId}`);
        await broadcastToParticipants(sessionId, {
          type: 'playback_update',
          isPlaying: afterData.isPlaying,
          seekPos: afterData.seekPos,
          currentSong: afterData.currentSong,
          timestamp: Date.now()
        });
      }

      // Check if queue changed
      if (JSON.stringify(beforeData.queue) !== JSON.stringify(afterData.queue)) {
        logger.info(`Broadcasting queue update for session ${sessionId}`);
        await broadcastToParticipants(sessionId, {
          type: 'queue_update',
          queue: afterData.queue,
          timestamp: Date.now()
        });
      }

      // Check if participants changed
      if (beforeData.participants.length !== afterData.participants.length) {
        logger.info(`Broadcasting participants update for session ${sessionId}`);
        await broadcastToParticipants(sessionId, {
          type: 'participants_update',
          participants: afterData.participants,
          timestamp: Date.now()
        });
      }

    } catch (error) {
      logger.error('Error in broadcastSessionUpdate:', error);
    }
  }
);

// Function to handle chat message broadcasting
export const broadcastChatMessage = onDocumentWritten(
  'sessions/{sessionId}/chat/{messageId}',
  async (event) => {
    try {
      const sessionId = event.params.sessionId;
      const messageData = event.data?.after?.data() as ChatMessage | undefined;

      if (!messageData) return;

      logger.info(`Broadcasting chat message for session ${sessionId}`);
      
      await broadcastToParticipants(sessionId, {
        type: 'chat_message',
        message: messageData,
        timestamp: Date.now()
      });

      // If it's an emoji, also trigger emoji overlay
      if (messageData.emoji) {
        await broadcastToParticipants(sessionId, {
          type: 'emoji_reaction',
          emoji: messageData.emoji,
          userName: messageData.userName,
          uid: messageData.uid,
          timestamp: Date.now()
        });
      }

    } catch (error) {
      logger.error('Error in broadcastChatMessage:', error);
    }
  }
);

// Function to clean up inactive sessions
export const cleanupInactiveSessions = onRequest({
  cors: true,
  memory: '256MiB',
  timeoutSeconds: 300
}, async (req, res) => {
  try {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    const inactiveSessionsQuery = db.collection('sessions')
      .where('updatedAt', '<', cutoffTime)
      .where('isActive', '==', true);
    
    const inactiveSessions = await inactiveSessionsQuery.get();
    
    if (inactiveSessions.empty) {
      res.json({ message: 'No inactive sessions found', cleaned: 0 });
      return;
    }

    const batch = db.batch();
    let cleanedCount = 0;

    for (const sessionDoc of inactiveSessions.docs) {
      const sessionId = sessionDoc.id;
      
      // Mark session as inactive
      batch.update(sessionDoc.ref, {
        isActive: false,
        endedAt: new Date(),
        endReason: 'inactive_cleanup'
      });

      // Clean up chat messages (keep last 50)
      const chatQuery = db.collection(`sessions/${sessionId}/chat`)
        .orderBy('sentAt', 'desc')
        .offset(50);
      
      const oldChatMessages = await chatQuery.get();
      oldChatMessages.docs.forEach(chatDoc => {
        batch.delete(chatDoc.ref);
      });

      cleanedCount++;
      logger.info(`Cleaned up inactive session: ${sessionId}`);
    }

    await batch.commit();
    
    res.json({ 
      message: `Cleaned up ${cleanedCount} inactive sessions`,
      cleaned: cleanedCount 
    });

  } catch (error) {
    logger.error('Error cleaning up inactive sessions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function to get session analytics
export const getSessionAnalytics = onRequest({
  cors: true,
  memory: '256MiB'
}, async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    let startDate: Date;
    switch (timeframe) {
      case '1d':
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    const sessionsQuery = db.collection('sessions')
      .where('createdAt', '>=', startDate)
      .orderBy('createdAt', 'desc');
    
    const sessionsSnapshot = await sessionsQuery.get();
    
    const analytics = {
      totalSessions: sessionsSnapshot.size,
      activeSessions: 0,
      totalParticipants: 0,
      averageSessionDuration: 0,
      popularHosts: {},
      sessionsByDay: {},
      participantDistribution: {
        '1': 0,
        '2-5': 0,
        '6-10': 0,
        '10+': 0
      }
    };

    let totalDuration = 0;
    const hostCounts = {};
    const dailyCounts = {};

    sessionsSnapshot.docs.forEach(doc => {
      const session = doc.data() as SessionData;
      
      if (session.isActive) {
        analytics.activeSessions++;
      }
      
      analytics.totalParticipants += session.participants.length;
      
      // Calculate session duration
      const endTime = session.endedAt || new Date();
      const duration = endTime.getTime() - session.createdAt.getTime();
      totalDuration += duration;
      
      // Count by host
      hostCounts[session.hostUid] = (hostCounts[session.hostUid] || 0) + 1;
      
      // Count by day
      const day = session.createdAt.toISOString().split('T')[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
      
      // Participant distribution
      const participantCount = session.participants.length;
      if (participantCount === 1) {
        analytics.participantDistribution['1']++;
      } else if (participantCount <= 5) {
        analytics.participantDistribution['2-5']++;
      } else if (participantCount <= 10) {
        analytics.participantDistribution['6-10']++;
      } else {
        analytics.participantDistribution['10+']++;
      }
    });

    analytics.averageSessionDuration = analytics.totalSessions > 0 
      ? Math.round(totalDuration / analytics.totalSessions / 1000 / 60) // minutes
      : 0;
    
    analytics.popularHosts = Object.entries(hostCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [uid, count]) => ({ ...obj, [uid]: count }), {});
    
    analytics.sessionsByDay = dailyCounts;
    
    res.json(analytics);

  } catch (error) {
    logger.error('Error getting session analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to initialize a new session
async function initializeSession(sessionId: string, sessionData: SessionData) {
  try {
    // Create initial system message
    const welcomeMessage = {
      id: 'system_welcome',
      uid: 'system',
      userName: 'VibeLoop',
      text: `🎉 Welcome to the co-listening session! ${sessionData.hostName} is your host.`,
      sentAt: new Date()
    };

    await db.collection(`sessions/${sessionId}/chat`)
      .doc('system_welcome')
      .set(welcomeMessage);

    logger.info(`Initialized session ${sessionId} with welcome message`);

  } catch (error) {
    logger.error(`Error initializing session ${sessionId}:`, error);
  }
}

// Helper function to clean up a deleted session
async function cleanupSession(sessionId: string) {
  try {
    // Delete all chat messages
    const chatQuery = db.collection(`sessions/${sessionId}/chat`);
    const chatSnapshot = await chatQuery.get();
    
    const batch = db.batch();
    chatSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    logger.info(`Cleaned up ${chatSnapshot.size} chat messages for session ${sessionId}`);

  } catch (error) {
    logger.error(`Error cleaning up session ${sessionId}:`, error);
  }
}

// Helper function to broadcast updates to all participants
async function broadcastToParticipants(sessionId: string, update: any) {
  try {
    // In a real implementation, this would use FCM (Firebase Cloud Messaging)
    // to send push notifications to all participants
    // For now, we'll just log the broadcast
    
    logger.info(`Broadcasting to session ${sessionId}:`, {
      type: update.type,
      timestamp: update.timestamp
    });

    // Store the update in a broadcasts subcollection for real-time listeners
    await db.collection(`sessions/${sessionId}/broadcasts`)
      .add({
        ...update,
        broadcastAt: new Date()
      });

    // Clean up old broadcasts (keep last 100)
    const oldBroadcastsQuery = db.collection(`sessions/${sessionId}/broadcasts`)
      .orderBy('broadcastAt', 'desc')
      .offset(100);
    
    const oldBroadcasts = await oldBroadcastsQuery.get();
    if (!oldBroadcasts.empty) {
      const batch = db.batch();
      oldBroadcasts.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

  } catch (error) {
    logger.error(`Error broadcasting to session ${sessionId}:`, error);
  }
}

// Function to handle session heartbeat (keep sessions alive)
export const sessionHeartbeat = onRequest({
  cors: true,
  memory: '128MiB'
}, async (req, res) => {
  try {
    const { sessionId, uid } = req.body;
    
    if (!sessionId || !uid) {
      res.status(400).json({ error: 'Missing sessionId or uid' });
      return;
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();
    
    if (!sessionDoc.exists) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const sessionData = sessionDoc.data() as SessionData;
    
    // Update participant's last seen time
    const updatedParticipants = sessionData.participants.map(p => 
      p.uid === uid ? { ...p, lastSeen: new Date() } : p
    );

    await sessionRef.update({
      participants: updatedParticipants,
      updatedAt: new Date()
    });

    res.json({ success: true, timestamp: Date.now() });

  } catch (error) {
    logger.error('Error in session heartbeat:', error);
    res.status(500).json({ error: error.message });
  }
});