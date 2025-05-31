import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserGamificationData, BadgeDefinition, MoodLog, SongPlayLog, EarnedBadge } from '../types/gamification';
import { useAuthContext } from './AuthContext';
import { addDoc, collection, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
  const { user: currentUser } = useAuthContext();
  const [gamificationData, setGamificationData] = useState<UserGamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (currentUser?.uid) {
      const gamificationDocRef = doc(db, 'user_gamification', currentUser.uid);
      const unsubscribe = onSnapshot(gamificationDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setGamificationData(docSnapshot.data() as UserGamificationData);
        } else {
          console.warn('User gamification data not found for user:', currentUser.uid);
          setGamificationData(null);
        }
        setLoading(false);
      }, (err) => {
        setError(err as Error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const logMood = async (mood: string, source: string = 'app_interaction'): Promise<void> => {
    if (!currentUser?.uid) throw new Error('User not authenticated');

    const moodLog: MoodLog = {
      userId: currentUser.uid,
      mood,
      source,
      timestamp: Date.now(),
    };

    await addDoc(collection(db, 'user_mood_logs'), moodLog);
  };

  const logSongPlay = async (songId: string, genre: string, mood?: string): Promise<void> => {
    if (!currentUser?.uid) throw new Error('User not authenticated');

    const songPlayLog: SongPlayLog = {
      userId: currentUser.uid,
      songId,
      genre,
      mood,
      timestamp: Date.now(),
    };

    await addDoc(collection(db, 'user_song_plays'), songPlayLog);
  };

  const markBadgeAsSeen = async (badgeId: string, badgeType: 'moodExplorer' | 'genreCollector' | 'seasonal'): Promise<void> => {
    if (!currentUser?.uid || !gamificationData) throw new Error('User or gamification data not available');

    let badges: EarnedBadge[];
    switch (badgeType) {
      case 'moodExplorer':
        badges = gamificationData.moodExplorerBadges;
        break;
      case 'genreCollector':
        badges = gamificationData.genreCollectorBadges;
        break;
      case 'seasonal':
        badges = gamificationData.seasonalAchievements;
        break;
      default:
        throw new Error('Invalid badge type');
    }

    const updatedBadges = badges.map((badge) =>
      badge.badgeId === badgeId ? { ...badge, seen: true } : badge
    );

    const updatedData = {
      ...gamificationData,
      [badgeType === 'moodExplorer' ? 'moodExplorerBadges' :
       badgeType === 'genreCollector' ? 'genreCollectorBadges' :
       'seasonalAchievements']: updatedBadges
    };

    await updateDoc(doc(db, 'user_gamification', currentUser.uid), updatedData);
  };

  const getBadgeDetails = async (badgeId: string): Promise<BadgeDefinition | null> => {
    const badgeDoc = await getDoc(doc(db, 'badge_definitions', badgeId));
    return badgeDoc.exists() ? badgeDoc.data() as BadgeDefinition : null;
  };

  const value = {
    gamificationData,
    loading,
    error,
    logMood,
    logSongPlay,
    markBadgeAsSeen,
    getBadgeDetails
  };

  return (
    <GamificationContext.Provider value={value}>
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