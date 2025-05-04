import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5I-j7pmSojstgtnlcDPWHjDxEwPfF35A",
  authDomain: "vibe-loop-b6f4c.firebaseapp.com",
  projectId: "vibe-loop-b6f4c",
  storageBucket: "vibe-loop-b6f4c.firebasestorage.app",
  messagingSenderId: "797761591399",
  appId: "1:797761591399:web:93bec6ad1ca5d500d25cc2"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };