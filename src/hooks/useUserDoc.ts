import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserProfile } from '../context/AuthContext'; // Assuming UserProfile is exported from AuthContext

/**
 * Custom hook to get real-time updates for a user's profile document from Firestore.
 * @param uid The user ID of the profile to fetch.
 * @returns An object containing the user profile data and a loading state.
 */
export const useUserDoc = (uid: string | undefined | null): { profile: UserProfile | null; loading: boolean; error: Error | null } => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      setError(null); // No UID, so no profile to fetch
      return;
    }

    setLoading(true);
    setError(null);

    const userDocRef = doc(db, 'users', uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setProfile(docSnapshot.data() as UserProfile);
        } else {
          setProfile(null); // User document doesn't exist
          // setError(new Error('User profile not found.')); // Optional: set error if profile must exist
        }
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching user document for UID ${uid}:`, err);
        setError(err);
        setProfile(null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [uid]);

  return { profile, loading, error };
};
