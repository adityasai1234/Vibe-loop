import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firestoreService } from '../services/firestoreService'; // Assuming firestoreService is set up for this
import { UserGamificationData, EarnedBadge, BadgeDefinition, MoodLog, SongPlayLog, calculateLevel } from '../types/gamification';
import { useAuth } from './AuthContext'; // Assuming an AuthContext provides the current user
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Assuming db export from firebaseConfig

interface GamificationContextType {
  gamificationData: UserGamificationData | null;
  loading: boolean;
  error: Error | null;
  logMood: (mood: string, source?: string) => Promise<void>;
  logSongPlay: (songId: string, genre: string, mood?: string) => Promise<void>;
  markBadgeAsSeen: (badgeId: string, badgeType: 'moodExplorer' | 'genreCollector' | 'seasonal') => Promise<void>;
  getBadgeDetails: (badgeId: string) => Promise<BadgeDefinition | null>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
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
      // This will trigger the `processMoodLog` Cloud Function
      await firestoreService.addDocument('user_mood_logs', moodLog);
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
      // This will trigger the `processSongPlay` Cloud Function
      await firestoreService.addDocument('user_song_plays', songPlayLog);
    } catch (err) {
      console.error('Error logging song play:', err);
      setError(err as Error);
      throw err;
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
    if (badgeIndex === -1 || badgeCollectionToUpdate[badgeIndex].seen) return; // Not found or already seen

    const updatedBadges = [...badgeCollectionToUpdate];
    updatedBadges[badgeIndex] = { ...updatedBadges[badgeIndex], seen: true };

    const updatedData: Partial<UserGamificationData> = {};
    if (badgeType === 'moodExplorer') updatedData.moodExplorerBadges = updatedBadges;
    else if (badgeType === 'genreCollector') updatedData.genreCollectorBadges = updatedBadges;
    else if (badgeType === 'seasonal') updatedData.seasonalAchievements = updatedBadges;

    try {
      await firestoreService.updateDocument('user_gamification', currentUser.uid, updatedData);
    } catch (err) {
      console.error('Error marking badge as seen:', err);
      setError(err as Error);
      // Optionally revert local state change if Firestore update fails
      throw err;
    }
  };

  const getBadgeDetails = async (badgeId: string): Promise<BadgeDefinition | null> => {
    try {
      const badgeDef = await firestoreService.getDocument<BadgeDefinition>('badge_definitions', badgeId);
      return badgeDef || null;
    } catch (err) {
      console.error('Error fetching badge definition:', err);
      setError(err as Error);
      return null;
    }
  };

  return (
    <GamificationContext.Provider value={{ gamificationData, loading, error, logMood, logSongPlay, markBadgeAsSeen, getBadgeDetails }}>
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