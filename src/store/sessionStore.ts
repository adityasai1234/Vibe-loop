import { create } from 'zustand';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Song } from '../types';

export interface SessionData {
  id: string;
  hostUid: string;
  hostName: string;
  isPlaying: boolean;
  currentSong: Song | null;
  queue: Song[];
  seekPos: number; // seconds
  updatedAt: Date;
  participants: string[];
  maxParticipants: number;
}

export interface ChatMessage {
  id: string;
  uid: string;
  userName: string;
  text?: string;
  emoji?: string;
  sentAt: Date;
}

interface SessionStore {
  // Session state
  currentSession: SessionData | null;
  isHost: boolean;
  isConnected: boolean;
  participants: { uid: string; name: string }[];
  chatMessages: ChatMessage[];
  
  // WebRTC state
  peerConnection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  
  // Sync state
  lastSyncTime: number;
  driftTolerance: number; // milliseconds
  
  // Actions
  createSession: (hostUid: string, hostName: string, initialSong?: Song) => Promise<string>;
  joinSession: (sessionId: string, uid: string, userName: string) => Promise<boolean>;
  leaveSession: () => Promise<void>;
  updatePlayback: (isPlaying: boolean, seekPos: number, song?: Song) => Promise<void>;
  addToQueue: (song: Song) => Promise<void>;
  removeFromQueue: (songId: string) => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
  sendEmoji: (emoji: string) => Promise<void>;
  syncWithHost: (hostTime: number) => void;
  setupWebRTC: (sessionId: string, isHost: boolean) => Promise<void>;
  cleanupWebRTC: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  currentSession: null,
  isHost: false,
  isConnected: false,
  participants: [],
  chatMessages: [],
  peerConnection: null,
  dataChannel: null,
  lastSyncTime: 0,
  driftTolerance: 300, // 300ms tolerance

  createSession: async (hostUid: string, hostName: string, initialSong?: Song) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const sessionData: SessionData = {
      id: sessionId,
      hostUid,
      hostName,
      isPlaying: false,
      currentSong: initialSong || null,
      queue: initialSong ? [initialSong] : [],
      seekPos: 0,
      updatedAt: new Date(),
      participants: [hostUid],
      maxParticipants: 20
    };
    
    try {
      await setDoc(doc(db, 'sessions', sessionId), {
        ...sessionData,
        updatedAt: serverTimestamp()
      });
      
      set({ 
        currentSession: sessionData, 
        isHost: true, 
        isConnected: true,
        participants: [{ uid: hostUid, name: hostName }]
      });
      
      // Setup real-time listeners
      get().setupSessionListeners(sessionId);
      
      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  joinSession: async (sessionId: string, uid: string, userName: string) => {
    try {
      const sessionDoc = await getDoc(doc(db, 'sessions', sessionId));
      
      if (!sessionDoc.exists()) {
        throw new Error('Session not found');
      }
      
      const sessionData = sessionDoc.data() as SessionData;
      
      if (sessionData.participants.length >= sessionData.maxParticipants) {
        throw new Error('Session is full');
      }
      
      // Add user to participants
      const updatedParticipants = [...sessionData.participants, uid];
      
      await updateDoc(doc(db, 'sessions', sessionId), {
        participants: updatedParticipants,
        updatedAt: serverTimestamp()
      });
      
      set({ 
        currentSession: { ...sessionData, participants: updatedParticipants },
        isHost: false,
        isConnected: true
      });
      
      // Setup real-time listeners
      get().setupSessionListeners(sessionId);
      
      return true;
    } catch (error) {
      console.error('Error joining session:', error);
      return false;
    }
  },

  leaveSession: async () => {
    const { currentSession, isHost } = get();
    
    if (!currentSession) return;
    
    try {
      if (isHost) {
        // Host leaving - delete session
        await deleteDoc(doc(db, 'sessions', currentSession.id));
      } else {
        // Participant leaving - remove from participants list
        const updatedParticipants = currentSession.participants.filter(
          p => p !== currentSession.hostUid
        );
        
        await updateDoc(doc(db, 'sessions', currentSession.id), {
          participants: updatedParticipants,
          updatedAt: serverTimestamp()
        });
      }
      
      get().cleanupWebRTC();
      
      set({
        currentSession: null,
        isHost: false,
        isConnected: false,
        participants: [],
        chatMessages: []
      });
    } catch (error) {
      console.error('Error leaving session:', error);
    }
  },

  updatePlayback: async (isPlaying: boolean, seekPos: number, song?: Song) => {
    const { currentSession, isHost } = get();
    
    if (!currentSession || !isHost) return;
    
    try {
      const updateData: any = {
        isPlaying,
        seekPos,
        updatedAt: serverTimestamp()
      };
      
      if (song) {
        updateData.currentSong = song;
      }
      
      await updateDoc(doc(db, 'sessions', currentSession.id), updateData);
      
      // Send via WebRTC for real-time sync
      const { dataChannel } = get();
      if (dataChannel && dataChannel.readyState === 'open') {
        dataChannel.send(JSON.stringify({
          type: 'playback_update',
          isPlaying,
          seekPos,
          timestamp: Date.now(),
          song
        }));
      }
    } catch (error) {
      console.error('Error updating playback:', error);
    }
  },

  addToQueue: async (song: Song) => {
    const { currentSession, isHost } = get();
    
    if (!currentSession || !isHost) return;
    
    try {
      const updatedQueue = [...currentSession.queue, song];
      
      await updateDoc(doc(db, 'sessions', currentSession.id), {
        queue: updatedQueue,
        updatedAt: serverTimestamp()
      });
      
      set({
        currentSession: { ...currentSession, queue: updatedQueue }
      });
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  },

  removeFromQueue: async (songId: string) => {
    const { currentSession, isHost } = get();
    
    if (!currentSession || !isHost) return;
    
    try {
      const updatedQueue = currentSession.queue.filter(song => song.id !== songId);
      
      await updateDoc(doc(db, 'sessions', currentSession.id), {
        queue: updatedQueue,
        updatedAt: serverTimestamp()
      });
      
      set({
        currentSession: { ...currentSession, queue: updatedQueue }
      });
    } catch (error) {
      console.error('Error removing from queue:', error);
    }
  },

  sendChatMessage: async (message: string) => {
    const { currentSession } = get();
    
    if (!currentSession) return;
    
    try {
      await addDoc(collection(db, 'sessions', currentSession.id, 'chat'), {
        text: message,
        sentAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  },

  sendEmoji: async (emoji: string) => {
    const { currentSession } = get();
    
    if (!currentSession) return;
    
    try {
      await addDoc(collection(db, 'sessions', currentSession.id, 'chat'), {
        emoji,
        sentAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending emoji:', error);
    }
  },

  syncWithHost: (hostTime: number) => {
    const { driftTolerance } = get();
    const currentTime = Date.now();
    const drift = Math.abs(currentTime - hostTime);
    
    if (drift > driftTolerance) {
      // Sync audio playback time
      const audioElement = document.querySelector('audio') as HTMLAudioElement;
      if (audioElement) {
        const expectedTime = hostTime / 1000; // Convert to seconds
        const actualTime = audioElement.currentTime;
        const timeDrift = Math.abs(expectedTime - actualTime);
        
        if (timeDrift > 0.3) { // 300ms tolerance
          audioElement.currentTime = expectedTime;
        }
      }
    }
    
    set({ lastSyncTime: currentTime });
  },

  setupWebRTC: async (sessionId: string, isHost: boolean) => {
    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });
      
      if (isHost) {
        const dataChannel = peerConnection.createDataChannel('sync', {
          ordered: true
        });
        
        dataChannel.onopen = () => {
          console.log('Data channel opened');
        };
        
        set({ dataChannel });
      } else {
        peerConnection.ondatachannel = (event) => {
          const dataChannel = event.channel;
          
          dataChannel.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'playback_update') {
              get().syncWithHost(data.timestamp);
            }
          };
          
          set({ dataChannel });
        };
      }
      
      set({ peerConnection });
    } catch (error) {
      console.error('Error setting up WebRTC:', error);
    }
  },

  cleanupWebRTC: () => {
    const { peerConnection, dataChannel } = get();
    
    if (dataChannel) {
      dataChannel.close();
    }
    
    if (peerConnection) {
      peerConnection.close();
    }
    
    set({ peerConnection: null, dataChannel: null });
  },

  setupSessionListeners: (sessionId: string) => {
    // Listen to session updates
    const unsubscribeSession = onSnapshot(
      doc(db, 'sessions', sessionId),
      (doc) => {
        if (doc.exists()) {
          const sessionData = doc.data() as SessionData;
          set({ currentSession: sessionData });
        }
      }
    );
    
    // Listen to chat messages
    const unsubscribeChat = onSnapshot(
      collection(db, 'sessions', sessionId, 'chat'),
      (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ChatMessage[];
        
        set({ chatMessages: messages.sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime()) });
      }
    );
    
    // Store cleanup functions
    (get() as any).unsubscribeSession = unsubscribeSession;
    (get() as any).unsubscribeChat = unsubscribeChat;
  }
}));