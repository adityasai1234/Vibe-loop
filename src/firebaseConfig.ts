import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Validate required environment variables
const requiredEnvVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check for missing required values
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingVars);
  throw new Error(
    `Missing required Firebase environment variables: ${missingVars.join(", ")}`
  );
}

const firebaseConfig = {
  ...requiredEnvVars,
  // Optional configs
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally
let analytics = null;
if (firebaseConfig.measurementId) {
  // Check if analytics is supported (e.g., not in SSR)
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully');
    } else {
      console.log('Firebase Analytics not supported in this environment');
    }
  });
}

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// For debugging (remove in production)
console.log('Firebase Config:', {
  ...firebaseConfig,
  apiKey: '[REDACTED]' // Don't log the actual API key
});

export { app, analytics };
