import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCUVNvXtXyS73aX0VU8EP0M47QIhOoJi8k",
  authDomain: "timebank-122bc.firebaseapp.com",
  projectId: "timebank-122bc",
  storageBucket: "timebank-122bc.firebasestorage.app",
  messagingSenderId: "331743621517",
  appId: "1:331743621517:web:8d8a6174b14d4fe852cdc4",
  measurementId: "G-0VQDE01RZ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);