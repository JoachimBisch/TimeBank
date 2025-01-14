import { FirebaseOptions } from 'firebase/app';

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCUVNvXtXyS73aX0VU8EP0M47QIhOoJi8k",
  authDomain: "timebank-122bc.firebaseapp.com",
  projectId: "timebank-122bc",
  storageBucket: "timebank-122bc.firebasestorage.app",
  messagingSenderId: "331743621517",
  appId: "1:331743621517:web:8d8a6174b14d4fe852cdc4",
  measurementId: "G-0VQDE01RZ5"
};

export const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  
  for (const field of requiredFields) {
    if (!firebaseConfig[field as keyof FirebaseOptions]) {
      throw new Error(`Firebase config missing required field: ${field}`);
    }
  }
};