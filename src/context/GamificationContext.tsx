import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firestoreService } from '../services/firestoreService'; // Assuming firestoreService is set up for this
import { UserGamificationData, EarnedBadge, BadgeDefinition, MoodLog, SongPlayLog, calculateLevel } from '../types/gamification';
import { useAuthContext } from './AuthContext';
import { onSnapshot, doc, collection, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Assuming db export from firebaseConfig

interface GamificationContextType {
  gamificationData: UserGamificationData | null;
  loading: boolean;
  error: Error | null;
  logMood: (mood: string, source?: string) => Promise<void>;
  logSongPlay: (songId: string, genre: string, mood?: string) => Promise<void>;
  markBadgeAsSeen: (badgeId: string, badgeType: 'moodExplorer' | 'genreCollector' | 'seasonal') => Promise<void>;
  getBadgeDetails: (badgeId: string) => Promise<BadgeDefinition | null>;
  getMoodLog: () => Promise<MoodLog[]>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuthContext();
  const [gamificationData, setGamificationData] = useState<UserGamificationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (currentUser?.uid) {
      setLoading(true);
      const gamificationDocRef = doc(db, 'user_gamification', currentUser.uid);
      
      const unsubscribe = onSnapshot(gamificationDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserGamificationData;
          // Ensure level is correctly calculated if not already up-to-date
          data.level = calculateLevel(data.xp);
          setGamificationData(data);
        } else {
          // This case should ideally be handled by the backend initializing data.
          // For robustness, we can set a default or indicate no data.
          setGamificationData(null); 
          console.warn('User gamification data not found for user:', currentUser.uid);
        }
        setLoading(false);
      }, (err) => {
        console.error('Error fetching gamification data:', err);
        setError(err);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setGamificationData(null);
      setLoading(false);
    }
  }, [currentUser]);

  const logMood = async (mood: string, source: string = 'app_interaction'): Promise<void> => {
    if (!currentUser?.uid) throw new Error('User not authenticated');
    try {
      const moodLog: MoodLog = {
        userId: currentUser.uid,
        mood,
        timestamp: Date.now(),
        source,
      };
      // Add to user_mood_logs collection
      await addDoc(collection(db, 'user_mood_logs'), moodLog);
    } catch (err) {
      console.error('Error logging mood:', err);
      setError(err as Error);
      throw err;
    }
  };

  const logSongPlay = async (songId: string, genre: string, mood?: string): Promise<void> => {
    if (!currentUser?.uid) throw new Error('User not authenticated');
    try {
      const songPlayLog: SongPlayLog = {
        userId: currentUser.uid,
        songId,
        genre,
        mood,
        timestamp: Date.now(),
      };
      // Add to user_song_plays collection
      await addDoc(collection(db, 'user_song_plays'), songPlayLog);
    } catch (err) {
      console.error('Error logging song play:', err);
      setError(err as Error);
      throw err;
    }
    if (useAuthContext().currentUser?.uid) {
      // Optionally, you can also update the gamification data immediately
      // This is not strictly necessary if the Cloud Function handles it
      setGamificationData(prevData => {
        if (!prevData) return null;
        return {
          ...prevData,
          xp: prevData.xp + 10, // Example XP reward for song play
          level: calculateLevel(prevData.xp + 10),
        };
      });
    }
  };

  const markBadgeAsSeen = async (badgeId: string, badgeType: 'moodExplorer' | 'genreCollector' | 'seasonal'): Promise<void> => {
    if (!currentUser?.uid || !gamificationData) throw new Error('User or gamification data not available');
    
    let badgeCollectionToUpdate: EarnedBadge[] | undefined;
    switch (badgeType) {
        case 'moodExplorer': badgeCollectionToUpdate = gamificationData.moodExplorerBadges; break;
        case 'genreCollector': badgeCollectionToUpdate = gamificationData.genreCollectorBadges; break;
        case 'seasonal': badgeCollectionToUpdate = gamificationData.seasonalAchievements; break;
    }

    if (!badgeCollectionToUpdate) return;

    const badgeIndex = badgeCollectionToUpdate.findIndex(b => b.badgeId === badgeId);
    if (badgeIndex === -1 || badgeCollectionToUpdate[badgeIndex].seen) return;

    const updatedBadges = [...badgeCollectionToUpdate];
    updatedBadges[badgeIndex] = { ...updatedBadges[badgeIndex], seen: true };

    const updatedData: Partial<UserGamificationData> = {};
    if (badgeType === 'moodExplorer') updatedData.moodExplorerBadges = updatedBadges;
    else if (badgeType === 'genreCollector') updatedData.genreCollectorBadges = updatedBadges;
    else if (badgeType === 'seasonal') updatedData.seasonalAchievements = updatedBadges;

    try {
      await updateDoc(doc(db, 'user_gamification', currentUser.uid), updatedData);
    } catch (err) {
      console.error('Error marking badge as seen:', err);
      setError(err as Error);
      throw err;
    }
  };

  const getBadgeDetails = async (badgeId: string): Promise<BadgeDefinition | null> => {
    try {
      const badgeDoc = await getDoc(doc(db, 'badge_definitions', badgeId));
      if (!badgeDoc.exists()) return null;
      return badgeDoc.data() as BadgeDefinition;
    } catch (err) {
      console.error('Error fetching badge definition:', err);
      setError(err as Error);
      return null;
    }
  };

  const getMoodLog = async (): Promise<MoodLog[]> => {
    if (!currentUser?.uid) throw new Error('User not authenticated');
    try {
      const moodLogsQuery = query(
        collection(db, 'user_mood_logs'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(moodLogsQuery);
      return querySnapshot.docs.map(doc => doc.data() as MoodLog);
    } catch (err) {
      console.error('Error fetching mood logs:', err);
      setError(err as Error);
      return [];
    }
  };

  return (
    <GamificationContext.Provider value={{ 
      gamificationData, 
      loading, 
      error, 
      logMood, 
      logSongPlay, 
      markBadgeAsSeen, 
      getBadgeDetails,
      getMoodLog 
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};