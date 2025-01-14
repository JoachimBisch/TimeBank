import { getFirestore, Firestore } from 'firebase/firestore';
import { initializeFirebase } from './init';

let firestoreInstance: Firestore | undefined;

export const getFirebaseFirestore = (): Firestore => {
  if (!firestoreInstance) {
    const app = initializeFirebase();
    firestoreInstance = getFirestore(app);
    console.log('✅ Firestore initialized');
  }
  return firestoreInstance;
};