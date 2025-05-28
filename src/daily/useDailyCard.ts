import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useBadgeStore } from '../store/badgeStore';
import { useAuth } from '../context/AuthContext';
import { XP_REWARDS } from '../gamify/badges';

export interface DailyCard {
  type: 'tip' | 'lyric' | 'quiz';
  text: string;
  mediaUrl?: string;
  date: string;
}

export interface DailyCardState {
  card: DailyCard | null;
  isLoading: boolean;
  hasOpened: boolean;
  error: string | null;
}

export const useDailyCard = () => {
  const { currentUser: user } = useAuth();
  const { addXP, updateDailyCardStreak } = useBadgeStore();
  const [state, setState] = useState<DailyCardState>({
    card: null,
    isLoading: true,
    hasOpened: false,
    error: null
  });

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  useEffect(() => {
    loadDailyCard();
  }, [today]);

  const loadDailyCard = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // First check if card exists for today
      const cardDoc = await getDoc(doc(db, 'dailyCard', today));
      
      if (!cardDoc.exists()) {
        // Generate a new card if none exists
        await generateDailyCard();
        return;
      }
      
      const cardData = cardDoc.data() as DailyCard;
      
      // Check if user has opened today's card
      let hasOpened = false;
      if (user?.uid) {
        const userCardDoc = await getDoc(doc(db, 'users', user.uid, 'dailyCards', today));
        hasOpened = userCardDoc.exists();
      }
      
      setState({
        card: cardData,
        isLoading: false,
        hasOpened,
        error: null
      });
    } catch (error) {
      console.error('Error loading daily card:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load daily card'
      }));
    }
  };

  const generateDailyCard = async () => {
    const cardPool = [
      {
        type: 'tip' as const,
        text: 'Did you know? Listening to music you love releases dopamine, the same chemical released when eating food you crave!',
        mediaUrl: undefined
      },
      {
        type: 'tip' as const,
        text: 'Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.',
        mediaUrl: undefined
      },
      {
        type: 'lyric' as const,
        text: '"Music is the universal language of mankind" - Henry Wadsworth Longfellow',
        mediaUrl: undefined
      },
      {
        type: 'lyric' as const,
        text: '"Where words fail, music speaks" - Hans Christian Andersen',
        mediaUrl: undefined
      },
      {
        type: 'quiz' as const,
        text: 'Which genre typically has a BPM (beats per minute) range of 120-140? A) Classical B) EDM C) Jazz D) Folk',
        mediaUrl: undefined
      },
      {
        type: 'quiz' as const,
        text: 'What does "forte" mean in music? A) Soft B) Fast C) Loud D) Slow',
        mediaUrl: undefined
      },
      {
        type: 'tip' as const,
        text: 'Create a "mood playlist" for different emotions. Having go-to songs can help regulate your feelings throughout the day.',
        mediaUrl: undefined
      },
      {
        type: 'tip' as const,
        text: 'Studies show that singing along to music can reduce stress and boost your immune system!',
        mediaUrl: undefined
      }
    ];
    
    const randomCard = cardPool[Math.floor(Math.random() * cardPool.length)];
    const newCard: DailyCard = {
      ...randomCard,
      date: today
    };
    
    try {
      await setDoc(doc(db, 'dailyCard', today), newCard);
      setState({
        card: newCard,
        isLoading: false,
        hasOpened: false,
        error: null
      });
    } catch (error) {
      console.error('Error generating daily card:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to generate daily card'
      }));
    }
  };

  const openCard = async () => {
    if (!user?.uid || !state.card || state.hasOpened) return;
    
    try {
      // Mark card as opened
      await setDoc(doc(db, 'users', user.uid, 'dailyCards', today), {
        openedAt: serverTimestamp(),
        cardType: state.card.type
      });
      
      // Award XP
      await addXP(user.uid, XP_REWARDS.DAILY_CARD_OPEN, 'Daily card opened');
      
      // Update streak (simplified - in real app, calculate consecutive days)
      const currentStreak = await calculateDailyCardStreak(user.uid);
      await updateDailyCardStreak(user.uid, currentStreak);
      
      setState(prev => ({ ...prev, hasOpened: true }));
    } catch (error) {
      console.error('Error opening daily card:', error);
    }
  };

  const calculateDailyCardStreak = async (uid: string): Promise<number> => {
    // Simplified streak calculation
    // In a real app, you'd check consecutive days
    let streak = 1;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    try {
      const yesterdayDoc = await getDoc(doc(db, 'users', uid, 'dailyCards', yesterdayStr));
      if (yesterdayDoc.exists()) {
        // Could extend this to check further back
        streak = 2;
      }
    } catch (error) {
      console.error('Error calculating streak:', error);
    }
    
    return streak;
  };

  return {
    ...state,
    openCard,
    refreshCard: loadDailyCard
  };
};