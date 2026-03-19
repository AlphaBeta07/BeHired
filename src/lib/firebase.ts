import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase client configuration
// Values come from VITE_ environment variables (loaded by Vite at build time)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};

// Initialize Firebase client app
const app = initializeApp(firebaseConfig);

// Firebase Authentication — used for Google-native login
export const auth = getAuth(app);
