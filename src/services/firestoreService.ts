import { getFirestore, collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';

// Define the song metadata interface as specified in the requirements
export interface SongMetadata {
  title: string;
  artist: string;
  genre: string;
  mood: string;
  emoji: string;
  audioUrl: string;
  coverImageUrl: string;
  duration: number;
  popularity: number;
}

// Define the mood data structure
export interface MoodData {
  emoji: string;
  mood: string;
  genres: string[];
  examples: string[];
}

// Define the mood data based on the requirements
export const moodData = [
  {
    mood: 'Happy',
    emoji: '😊',
    genres: ['Pop', 'Dance', 'Funk'],
    examples: [
      'Uptown Funk - Bruno Mars',
      'Can\'t Stop the Feeling - Justin Timberlake',
      'Dancing Queen - ABBA',
      'Happier - Marshmello'
    ]
  },
  {
    mood: 'Sad',
    emoji: '😢', 
    genres: ['Acoustic', 'Soft Rock', 'Piano'],
    examples: [
      'Someone Like You - Adele',
      'Hurt - Johnny Cash',
      'The Night We Met - Lord Huron',
      'Skinny Love - Bon Iver'
    ]
  },
  {
    mood: 'Angry',
    emoji: '😠',
    genres: ['Rock', 'Metal', 'Rap'],
    examples: [
      'Break Stuff - Limp Bizkit',
      'Killing in the Name - Rage Against the Machine',
      'Last Resort - Papa Roach',
      'Bulls on Parade - Rage Against the Machine'
    ]
  },
  {
    mood: 'Sleepy',
    emoji: '😴',
    genres: ['Lo-fi', 'Ambient', 'Chill'],
    examples: ['"Weightless" – Marconi Union', 'Lo-fi Chillhop playlist']
  },
  {
    mood: 'Romantic',
    emoji: '😍',
    genres: ['R&B', 'Soul', 'Love Songs'],
    examples: ['"All of Me" – John Legend', '"Perfect" – Ed Sheeran']
  },
  {
    mood: 'Angry',
    emoji: '😠',
    genres: ['Rock', 'Rap', 'Heavy Metal'],
    examples: ['"Breaking the Habit" – Linkin Park', '"Rap God" – Eminem']
  },
  {
    mood: 'Excited',
    emoji: '🤩',
    genres: ['EDM', 'Electro Pop', 'Future Bass'],
    examples: ['"Titanium" – David Guetta', '"Stay" – Zedd & Alessia Cara']
  },
  {
    mood: 'Calm',
    emoji: '😌',
    genres: ['Jazz', 'Classical', 'Chill'],
    examples: ['"Clair de Lune" – Debussy', '"Blue in Green" – Miles Davis']
  }
];

// Journal entry interface
export interface JournalEntryData {
  userId: string;
  mood: string;
  note?: string;
  timestamp: number;
  songs?: (SongMetadata & { id: string })[];
}

// Firestore service class
export class FirestoreService {
  private db = getFirestore(app);
  private auth = getAuth(app);

  // Get songs for a specific mood
  async getSongsByMood(mood: string): Promise<SongMetadata[]> {
    try {
      const moodInfo = moodData.find(m => m.mood === mood);
      if (!moodInfo) return [];
      
      // Add error handling for collection path
      const moodCollectionPath = `moods/${encodeURIComponent(moodInfo.emoji)}_${mood.toLowerCase()}/songs`;
      const songsCollection = collection(this.db, moodCollectionPath);
      
      const querySnapshot = await getDocs(songsCollection);
      const songs: SongMetadata[] = [];
      
      querySnapshot.forEach((doc) => {
        songs.push({ id: doc.id, ...doc.data() } as SongMetadata & { id: string });
      });
      
      return songs;
    } catch (error) {
      console.error('Error fetching songs by mood:', error);
      return [];
    }
  }

  // Save user's mood selection
  async saveUserMood(mood: string): Promise<void> {
    try {
      if (!this.auth.currentUser) return;
      
      const userRef = doc(this.db, 'users', this.auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Update existing user document
        await updateDoc(userRef, {
          lastMood: mood,
          moodHistory: arrayUnion({
            mood,
            timestamp: new Date().getTime()
          })
        });
      } else {
        // Create new user document
        await updateDoc(userRef, {
          lastMood: mood,
          moodHistory: [{
            mood,
            timestamp: new Date().getTime()
          }]
        });
      }
    } catch (error) {
      console.error('Error saving user mood:', error);
    }
  }

  // Rate a song's mood match
  async rateMoodMatch(songId: string, mood: string, isMatch: boolean): Promise<void> {
    try {
      if (!this.auth.currentUser) return;
      
      // Get the emoji for the mood
      const moodInfo = moodData.find(m => m.mood === mood);
      if (!moodInfo) return;
      
      // Format the collection path
      const songRef = doc(this.db, `moods/${moodInfo.emoji}_${mood.toLowerCase()}/songs`, songId);
      
      // Update the song's rating
      await updateDoc(songRef, {
        moodMatchRatings: arrayUnion({
          userId: this.auth.currentUser.uid,
          isMatch,
          timestamp: new Date().getTime()
        })
      });
    } catch (error) {
      console.error('Error rating mood match:', error);
    }
  }

  // Add song to user's favorites
  async addToFavorites(songId: string): Promise<void> {
    try {
      if (!this.auth.currentUser) return;
      
      const userRef = doc(this.db, 'users', this.auth.currentUser.uid);
      
      await updateDoc(userRef, {
        favorites: arrayUnion(songId)
      });
    } catch (error) {
      console.error('Error adding song to favorites:', error);
    }
  }

  // Get user's journal entries
  async getUserJournalEntries(userId: string): Promise<any[]> {
    try {
      const entriesCollection = collection(this.db, `users/${userId}/journalEntries`);
      const querySnapshot = await getDocs(entriesCollection);
      const entries: any[] = [];
      
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      
      return entries;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }
  }

  // Save a journal entry
  async saveJournalEntry(entryData: JournalEntryData): Promise<void> {
    try {
      const { userId, ...entryFields } = entryData;
      const entriesCollection = collection(this.db, `users/${userId}/journalEntries`);
      
      // Check if an entry for this date already exists
      const entryDate = new Date(entryData.timestamp);
      const startOfDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate()).getTime();
      const endOfDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate() + 1).getTime() - 1;
      
      const q = query(
        entriesCollection,
        where('timestamp', '>=', startOfDay),
        where('timestamp', '<=', endOfDay)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing entry
        const docRef = doc(entriesCollection, querySnapshot.docs[0].id);
        await updateDoc(docRef, entryFields);
      } else {
        // Create new entry
        await addDoc(entriesCollection, entryFields);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  }

  // Get recently played songs for a user
  async getRecentlyPlayedSongs(userId: string): Promise<(SongMetadata & { id: string })[]> {
    try {
      const userRef = doc(this.db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return [];
      
      const userData = userDoc.data();
      const recentSongIds = userData.recentlyPlayed || [];
      
      // Fetch song details for each ID
      const songs: (SongMetadata & { id: string })[] = [];
      
      for (const songId of recentSongIds) {
        // In a real app, you would query the songs collection
        // This is a simplified example
        const allMoods = moodData.map(m => `moods/${m.emoji}_${m.mood.toLowerCase()}/songs`);
        
        for (const moodPath of allMoods) {
          const songRef = doc(this.db, moodPath, songId);
          const songDoc = await getDoc(songRef);
          
          if (songDoc.exists()) {
            songs.push({ id: songDoc.id, ...songDoc.data() } as SongMetadata & { id: string });
            break;
          }
        }
      }
      
      return songs;
    } catch (error) {
      console.error('Error fetching recently played songs:', error);
      return [];
    }
  }
}

// Export an instance of FirestoreService to be used throughout the app
export const firestoreService = new FirestoreService();