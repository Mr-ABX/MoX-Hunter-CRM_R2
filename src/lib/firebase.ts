import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCcjhKblRgTAf86VS-bhZ3p7Tx8SemO3aA",
  authDomain: "mox-hunter---the-ai-wolf-crm.firebaseapp.com",
  projectId: "mox-hunter---the-ai-wolf-crm",
  storageBucket: "mox-hunter---the-ai-wolf-crm.firebasestorage.app",
  messagingSenderId: "682972820825",
  appId: "1:682972820825:web:ef4f05b6be728613f00848"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let db: Firestore;
if (typeof window !== 'undefined') {
  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true
    });
  } catch (e) {
    db = getFirestore(app);
  }
} else {
  db = getFirestore(app);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };
