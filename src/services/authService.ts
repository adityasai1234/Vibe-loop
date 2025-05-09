import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut,
  User,
  UserCredential
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

// Interface for user data stored in Firestore
export interface UserData {
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: any; // serverTimestamp
  lastLoginAt?: any; // serverTimestamp
}

/**
 * Sign in with Google using popup
 * @returns User credential
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  // Save user data to Firestore if it's a new user
  await saveUserData(result.user);
  
  return result;
};

/**
 * Sign in with email and password
 * @param email User email
 * @param password User password
 * @returns User credential
 */
export const loginWithEmailPassword = async (email: string, password: string): Promise<UserCredential> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  
  // Update last login timestamp
  const userRef = doc(db, 'users', result.user.uid);
  await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
  
  return result;
};

/**
 * Register a new user with email and password
 * @param email User email
 * @param password User password
 * @returns User credential
 */
export const registerWithEmailPassword = async (email: string, password: string): Promise<UserCredential> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Save user data to Firestore
  await saveUserData(result.user);
  
  return result;
};

/**
 * Send password reset email
 * @param email User email
 */
export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Sign out the current user
 */
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Save user data to Firestore
 * @param user Firebase user
 */
export const saveUserData = async (user: User): Promise<void> => {
  if (!user.uid) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    // New user - create document
    const userData: UserData = {
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    };
    
    await setDoc(userRef, userData);
  } else {
    // Existing user - update last login
    await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
  }
};

/**
 * Get current authenticated user
 * @returns Firebase user or null
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export const isUserAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

export default {
  signInWithGoogle,
  loginWithEmailPassword,
  registerWithEmailPassword,
  sendPasswordReset,
  logoutUser,
  saveUserData,
  getCurrentUser,
  isUserAuthenticated
};