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
export const moodData: MoodData[] = [
  {
    emoji: '😊',
    mood: 'Happy',
    genres: ['Pop', 'Dance', 'Funk'],
    examples: ['"Happy" – Pharrell', '"Uptown Funk" – Bruno Mars']
  },
  {
    emoji: '😢',
    mood: 'Sad',
    genres: ['Acoustic', 'Soft Rock'],
    examples: ['"Someone Like You" – Adele', '"Fix You" – Coldplay']
  },
  {
    emoji: '😴',
    mood: 'Sleepy',
    genres: ['Lo-fi', 'Ambient', 'Chill'],
    examples: ['"Weightless" – Marconi Union', 'Lo-fi Chillhop playlist']
  },
  {
    emoji: '😍',
    mood: 'Romantic',
    genres: ['R&B', 'Soul', 'Love Songs'],
    examples: ['"All of Me" – John Legend', '"Perfect" – Ed Sheeran']
  },
  {
    emoji: '😠',
    mood: 'Angry',
    genres: ['Rock', 'Rap', 'Heavy Metal'],
    examples: ['"Breaking the Habit" – Linkin Park', '"Rap God" – Eminem']
  },
  {
    emoji: '🤩',
    mood: 'Excited',
    genres: ['EDM', 'Electro Pop', 'Future Bass'],
    examples: ['"Titanium" – David Guetta', '"Stay" – Zedd & Alessia Cara']
  },
  {
    emoji: '😌',
    mood: 'Calm',
    genres: ['Jazz', 'Classical', 'Chill'],
    examples: ['"Clair de Lune" – Debussy', '"Blue in Green" – Miles Davis']
  }
];

// Firestore service class
class FirestoreService {
  private db = getFirestore(app);
  private auth = getAuth(app);

  // Get songs for a specific mood
  async getSongsByMood(mood: string): Promise<SongMetadata[]> {
    try {
      // Get the emoji for the mood
      const moodInfo = moodData.find(m => m.mood === mood);
      if (!moodInfo) return [];
      
      // Format the collection path as specified in the requirements
      const moodCollectionPath = `moods/${moodInfo.emoji}_${mood.toLowerCase()}/songs`;
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
}

// Export a singleton instance
export const firestoreService = new FirestoreService();