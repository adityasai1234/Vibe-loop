// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For production, these values should be stored in environment variables
// Create a .env file in the root directory and add your Firebase config there
// Example: VITE_FIREBASE_API_KEY=your_api_key
const firebaseConfig = {
    apiKey: "AIzaSyB5I-j7pmSojstgtnlcDPWHjDxEwPfF35A",
    authDomain: "vibe-loop-b6f4c.firebaseapp.com",
    projectId: "vibe-loop-b6f4c",
    storageBucket: "vibe-loop-b6f4c.firebasestorage.app",
    messagingSenderId: "797761591399",
    appId: "1:797761591399:web:93bec6ad1ca5d500d25cc2",
    measurementId: "G-M9J08T9DE4"
  };
// IMPORTANT: Replace the placeholder values above with your actual Firebase project configuration
// You can find these values in your Firebase project settings

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
export default app;
