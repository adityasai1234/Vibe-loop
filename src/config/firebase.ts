// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export default app;