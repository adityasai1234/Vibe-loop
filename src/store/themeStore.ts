import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebaseConfig';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  syncThemeWithFirebase: (userId: string) => Promise<void>;
  loadThemeFromFirebase: (userId: string) => Promise<void>;
}

const db = getFirestore(app);
const auth = getAuth(app);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: true,
      toggleTheme: () => {
        set((state) => ({ isDark: !state.isDark }));
        
        // Sync with Firebase if user is logged in
        const auth = getAuth(app);
        if (auth.currentUser) {
          get().syncThemeWithFirebase(auth.currentUser.uid);
        }
      },
      
      // Save theme preference to Firebase
      syncThemeWithFirebase: async (userId: string) => {
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            await updateDoc(userDocRef, { isDarkTheme: get().isDark });
          } else {
            await setDoc(userDocRef, { 
              isDarkTheme: get().isDark,
              createdAt: new Date() 
            });
          }
        } catch (error) {
          console.error('Error syncing theme with Firebase:', error);
        }
      },
      
      // Load theme preference from Firebase
      loadThemeFromFirebase: async (userId: string) => {
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data().isDarkTheme !== undefined) {
            set({ isDark: userDoc.data().isDarkTheme });
          }
        } catch (error) {
          console.error('Error loading theme from Firebase:', error);
        }
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
// ... 