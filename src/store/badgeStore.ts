import { create } from 'zustand';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BADGES, XP_REWARDS, getUserLevel, Badge } from '../gamify/badges';

interface UnlockedBadge {
  id: string;
  unlockedAt: Date;
}

interface BadgeStore {
  xp: number;
  level: string;
  unlockedBadges: UnlockedBadge[];
  moodStreak: number;
  dailyCardStreak: number;
  totalShares: number;
  sessionsHosted: number;
  isLoading: boolean;
  
  // Actions
  initializeBadges: (uid: string) => Promise<void>;
  addXP: (uid: string, amount: number, reason: string) => Promise<void>;
  checkAndUnlockBadges: (uid: string) => Promise<Badge[]>;
  updateMoodStreak: (uid: string, streak: number) => Promise<void>;
  updateDailyCardStreak: (uid: string, streak: number) => Promise<void>;
  incrementShares: (uid: string) => Promise<void>;
  incrementSessionsHosted: (uid: string) => Promise<void>;
}

export const useBadgeStore = create<BadgeStore>((set, get) => ({
  xp: 0,
  level: 'Bronze',
  unlockedBadges: [],
  moodStreak: 0,
  dailyCardStreak: 0,
  totalShares: 0,
  sessionsHosted: 0,
  isLoading: false,

  initializeBadges: async (uid: string) => {
    set({ isLoading: true });
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      const userData = userDoc.data();
      
      if (userData) {
        const xp = userData.xp || 0;
        const level = getUserLevel(xp);
        
        // Get unlocked badges
        const badgesSnapshot = await getDoc(doc(db, 'users', uid, 'badges', 'unlocked'));
        const badgesData = badgesSnapshot.data();
        const unlockedBadges = badgesData?.badges || [];
        
        set({
          xp,
          level,
          unlockedBadges,
          moodStreak: userData.moodStreak || 0,
          dailyCardStreak: userData.dailyCardStreak || 0,
          totalShares: userData.totalShares || 0,
          sessionsHosted: userData.sessionsHosted || 0
        });
      }
    } catch (error) {
      console.error('Error initializing badges:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addXP: async (uid: string, amount: number, reason: string) => {
    const { xp } = get();
    const newXP = xp + amount;
    const newLevel = getUserLevel(newXP);
    
    try {
      await updateDoc(doc(db, 'users', uid), {
        xp: newXP,
        level: newLevel,
        lastXPUpdate: serverTimestamp()
      });
      
      // Log XP gain
      await addDoc(collection(db, 'users', uid, 'xpHistory'), {
        amount,
        reason,
        timestamp: serverTimestamp(),
        totalXP: newXP
      });
      
      set({ xp: newXP, level: newLevel });
      
      // Check for new badges
      await get().checkAndUnlockBadges(uid);
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  },

  checkAndUnlockBadges: async (uid: string) => {
    const { xp, unlockedBadges, moodStreak, dailyCardStreak, totalShares, sessionsHosted } = get();
    const newlyUnlocked: Badge[] = [];
    
    for (const badge of BADGES) {
      // Skip if already unlocked
      if (unlockedBadges.some(ub => ub.id === badge.id)) continue;
      
      let conditionMet = false;
      
      switch (badge.condition.type) {
        case 'total_xp':
          conditionMet = xp >= badge.condition.value;
          break;
        case 'mood_streak':
          conditionMet = moodStreak >= badge.condition.value;
          break;
        case 'daily_cards':
          conditionMet = dailyCardStreak >= badge.condition.value;
          break;
        case 'shares':
          conditionMet = totalShares >= badge.condition.value;
          break;
        case 'sessions_hosted':
          conditionMet = sessionsHosted >= badge.condition.value;
          break;
      }
      
      if (conditionMet) {
        const unlockedBadge = {
          id: badge.id,
          unlockedAt: new Date()
        };
        
        try {
          // Save to Firestore
          const badgesRef = doc(db, 'users', uid, 'badges', 'unlocked');
          const currentBadges = [...unlockedBadges, unlockedBadge];
          
          await setDoc(badgesRef, {
            badges: currentBadges,
            lastUpdated: serverTimestamp()
          }, { merge: true });
          
          newlyUnlocked.push(badge);
        } catch (error) {
          console.error('Error unlocking badge:', error);
        }
      }
    }
    
    if (newlyUnlocked.length > 0) {
      set({ unlockedBadges: [...unlockedBadges, ...newlyUnlocked.map(b => ({ id: b.id, unlockedAt: new Date() }))] });
    }
    
    return newlyUnlocked;
  },

  updateMoodStreak: async (uid: string, streak: number) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        moodStreak: streak,
        lastMoodLog: serverTimestamp()
      });
      
      set({ moodStreak: streak });
      await get().checkAndUnlockBadges(uid);
    } catch (error) {
      console.error('Error updating mood streak:', error);
    }
  },

  updateDailyCardStreak: async (uid: string, streak: number) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        dailyCardStreak: streak,
        lastCardOpen: serverTimestamp()
      });
      
      set({ dailyCardStreak: streak });
      await get().checkAndUnlockBadges(uid);
    } catch (error) {
      console.error('Error updating daily card streak:', error);
    }
  },

  incrementShares: async (uid: string) => {
    const { totalShares } = get();
    const newTotal = totalShares + 1;
    
    try {
      await updateDoc(doc(db, 'users', uid), {
        totalShares: newTotal,
        lastShare: serverTimestamp()
      });
      
      set({ totalShares: newTotal });
      await get().checkAndUnlockBadges(uid);
    } catch (error) {
      console.error('Error incrementing shares:', error);
    }
  },

  incrementSessionsHosted: async (uid: string) => {
    const { sessionsHosted } = get();
    const newTotal = sessionsHosted + 1;
    
    try {
      await updateDoc(doc(db, 'users', uid), {
        sessionsHosted: newTotal,
        lastSessionHosted: serverTimestamp()
      });
      
      set({ sessionsHosted: newTotal });
      await get().checkAndUnlockBadges(uid);
    } catch (error) {
      console.error('Error incrementing sessions hosted:', error);
    }
  }
}));