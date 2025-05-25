import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

interface DailyCard {
  type: 'tip' | 'lyric' | 'quiz';
  text: string;
  mediaUrl?: string;
  metadata?: {
    artist?: string;
    song?: string;
    genre?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    answer?: string;
  };
}

// Pool of daily cards
const DAILY_CARDS: DailyCard[] = [
  // Music Tips
  {
    type: 'tip',
    text: '🎧 Pro tip: Use the "Focus" mode while studying - it filters songs with fewer lyrics and steady beats to help you concentrate better!'
  },
  {
    type: 'tip',
    text: '🌙 Did you know? Listening to ambient music 30 minutes before bed can improve your sleep quality by up to 35%!'
  },
  {
    type: 'tip',
    text: '🏃‍♂️ For the perfect workout playlist, aim for songs with 120-140 BPM - it naturally matches your heart rate during exercise!'
  },
  {
    type: 'tip',
    text: '🎵 Try the "Discovery Mix" feature - it learns from your listening habits and introduces you to new artists similar to your taste!'
  },
  {
    type: 'tip',
    text: '🎨 Create mood-based playlists! Different colors and emotions in music can actually influence your productivity and creativity.'
  },
  {
    type: 'tip',
    text: '🔄 Use the "Crossfade" feature to create seamless transitions between songs - perfect for parties and focused work sessions!'
  },
  {
    type: 'tip',
    text: '📱 Share your favorite 15-second snippets directly to social media using our Snippet Share feature - earn XP while spreading good vibes!'
  },
  {
    type: 'tip',
    text: '🎯 Set daily listening goals! Regular music engagement can boost your mood and help you discover new genres you never knew you\'d love.'
  },

  // Famous Lyrics
  {
    type: 'lyric',
    text: '"Music is the universal language of mankind" - Henry Wadsworth Longfellow',
    metadata: {
      artist: 'Henry Wadsworth Longfellow'
    }
  },
  {
    type: 'lyric',
    text: '"Where words fail, music speaks" - Hans Christian Andersen',
    metadata: {
      artist: 'Hans Christian Andersen'
    }
  },
  {
    type: 'lyric',
    text: '"Music can heal the wounds which medicine cannot touch" - Debasish Mridha',
    metadata: {
      artist: 'Debasish Mridha'
    }
  },
  {
    type: 'lyric',
    text: '"Without music, life would be a mistake" - Friedrich Nietzsche',
    metadata: {
      artist: 'Friedrich Nietzsche'
    }
  },
  {
    type: 'lyric',
    text: '"Music is the wine which inspires one to new generative processes" - Ludwig van Beethoven',
    metadata: {
      artist: 'Ludwig van Beethoven'
    }
  },
  {
    type: 'lyric',
    text: '"Music is the strongest form of magic" - Marilyn Manson',
    metadata: {
      artist: 'Marilyn Manson'
    }
  },

  // Music Trivia/Quiz
  {
    type: 'quiz',
    text: 'Which instrument has 88 keys?',
    metadata: {
      difficulty: 'easy',
      answer: 'Piano'
    }
  },
  {
    type: 'quiz',
    text: 'What does "BPM" stand for in music?',
    metadata: {
      difficulty: 'easy',
      answer: 'Beats Per Minute'
    }
  },
  {
    type: 'quiz',
    text: 'Which music streaming service was founded first: Spotify or Apple Music?',
    metadata: {
      difficulty: 'medium',
      answer: 'Spotify (2006 vs 2015)'
    }
  },
  {
    type: 'quiz',
    text: 'What is the most streamed song of all time on Spotify?',
    metadata: {
      difficulty: 'hard',
      answer: 'Blinding Lights by The Weeknd'
    }
  },
  {
    type: 'quiz',
    text: 'Which genre originated in Jamaica in the late 1960s?',
    metadata: {
      difficulty: 'medium',
      answer: 'Reggae'
    }
  },
  {
    type: 'quiz',
    text: 'How many strings does a standard guitar have?',
    metadata: {
      difficulty: 'easy',
      answer: '6'
    }
  },
  {
    type: 'quiz',
    text: 'Which city is considered the birthplace of jazz music?',
    metadata: {
      difficulty: 'medium',
      answer: 'New Orleans'
    }
  },
  {
    type: 'quiz',
    text: 'What does "Lo-fi" stand for in music production?',
    metadata: {
      difficulty: 'medium',
      answer: 'Low Fidelity'
    }
  },

  // Seasonal/Special Cards
  {
    type: 'tip',
    text: '🎄 Holiday vibes: Create a collaborative playlist with family and friends - everyone can add their favorite festive songs!'
  },
  {
    type: 'tip',
    text: '☀️ Summer playlist tip: Mix upbeat tracks with chill vibes - perfect for both beach parties and sunset relaxation!'
  },
  {
    type: 'tip',
    text: '🍂 Fall mood: Acoustic and indie folk songs pair perfectly with cozy sweater weather and warm coffee!'
  },
  {
    type: 'tip',
    text: '❄️ Winter listening: Ambient and classical music can make cold days feel warm and contemplative.'
  },

  // VibeLoop Specific
  {
    type: 'tip',
    text: '🏆 Maintain your mood streak! Log your daily mood to unlock exclusive badges and climb the XP leaderboard.'
  },
  {
    type: 'tip',
    text: '🎧 Try co-listening sessions with friends - sync your music and chat in real-time for the ultimate shared experience!'
  },
  {
    type: 'tip',
    text: '🎴 Don\'t forget to check your daily surprise card - new tips, lyrics, and trivia await you every day!'
  },
  {
    type: 'tip',
    text: '🌈 Your mood affects the app\'s theme! Notice how the background gradient changes based on your current song\'s vibe.'
  }
];

// Function to get today's date in YYYY-MM-DD format (IST timezone)
function getTodayIST(): string {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istTime = new Date(now.getTime() + istOffset);
  
  return istTime.toISOString().split('T')[0];
}

// Function to select a daily card based on date
function selectDailyCard(date: string): DailyCard {
  // Use date as seed for consistent daily selection
  const dateNum = parseInt(date.replace(/-/g, ''), 10);
  const index = dateNum % DAILY_CARDS.length;
  return DAILY_CARDS[index];
}

// Cloud Function that runs daily at 00:05 IST
export const generateDailyCard = onSchedule({
  schedule: '5 0 * * *', // 00:05 UTC (05:35 IST)
  timeZone: 'Asia/Kolkata',
  memory: '256MiB',
  timeoutSeconds: 60
}, async (event) => {
  try {
    const today = getTodayIST();
    logger.info(`Generating daily card for ${today}`);

    // Check if card already exists for today
    const cardRef = db.collection('dailyCards').doc(today);
    const existingCard = await cardRef.get();

    if (existingCard.exists) {
      logger.info(`Daily card already exists for ${today}`);
      return;
    }

    // Select and save today's card
    const selectedCard = selectDailyCard(today);
    
    const cardData = {
      ...selectedCard,
      date: today,
      createdAt: new Date(),
      views: 0,
      likes: 0
    };

    await cardRef.set(cardData);
    
    logger.info(`Daily card created for ${today}:`, {
      type: selectedCard.type,
      text: selectedCard.text.substring(0, 50) + '...'
    });

    // Optional: Clean up old cards (keep last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    const oldCardsQuery = db.collection('dailyCards')
      .where('date', '<', cutoffDate);
    
    const oldCards = await oldCardsQuery.get();
    
    if (!oldCards.empty) {
      const batch = db.batch();
      oldCards.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      logger.info(`Cleaned up ${oldCards.size} old daily cards`);
    }

  } catch (error) {
    logger.error('Error generating daily card:', error);
    throw error;
  }
});

// Helper function to manually trigger card generation (for testing)
export const generateDailyCardManual = onRequest({
  cors: true,
  memory: '256MiB'
}, async (req, res) => {
  try {
    const today = getTodayIST();
    const selectedCard = selectDailyCard(today);
    
    const cardData = {
      ...selectedCard,
      date: today,
      createdAt: new Date(),
      views: 0,
      likes: 0
    };

    const cardRef = db.collection('dailyCards').doc(today);
    await cardRef.set(cardData, { merge: true });
    
    res.json({
      success: true,
      date: today,
      card: cardData
    });
    
  } catch (error) {
    logger.error('Error in manual card generation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Function to get card statistics
export const getDailyCardStats = onRequest({
  cors: true,
  memory: '256MiB'
}, async (req, res) => {
  try {
    const cardsSnapshot = await db.collection('dailyCards')
      .orderBy('date', 'desc')
      .limit(30)
      .get();
    
    const stats = {
      totalCards: cardsSnapshot.size,
      totalViews: 0,
      totalLikes: 0,
      typeDistribution: {
        tip: 0,
        lyric: 0,
        quiz: 0
      },
      recentCards: []
    };
    
    cardsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      stats.totalViews += data.views || 0;
      stats.totalLikes += data.likes || 0;
      stats.typeDistribution[data.type]++;
      
      if (stats.recentCards.length < 7) {
        stats.recentCards.push({
          date: data.date,
          type: data.type,
          views: data.views || 0,
          likes: data.likes || 0
        });
      }
    });
    
    res.json(stats);
    
  } catch (error) {
    logger.error('Error getting daily card stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});