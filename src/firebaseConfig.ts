import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5I-j7pmSojstgtnlcDPWHjDxEwPfF35A",
  authDomain: "vibe-loop-b6f4c.firebaseapp.com",
  databaseURL: "https://vibe-loop-b6f4c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vibe-loop-b6f4c",
  storageBucket: "vibe-loop-b6f4c.firebasestorage.app",
  messagingSenderId: "797761591399",
  appId: "1:797761591399:web:93bec6ad1ca5d500d25cc2",
  measurementId: "G-M9J08T9DE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export { app, analytics };
