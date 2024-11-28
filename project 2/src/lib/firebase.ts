import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBmzBsMUsZtTOHF-unsPvbFkuYZHIWN4-w",
  authDomain: "smardy-b35b0.firebaseapp.com",
  projectId: "smardy-b35b0",
  storageBucket: "smardy-b35b0.appspot.com",
  messagingSenderId: "469339972929",
  appId: "1:469339972929:web:84430e8fbf32781d0b2dc0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});