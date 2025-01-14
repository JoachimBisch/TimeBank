import { getAuth, Auth } from 'firebase/auth';
import { initializeFirebase } from './init';

let authInstance: Auth | undefined;

export const getFirebaseAuth = (): Auth => {
  if (!authInstance) {
    const app = initializeFirebase();
    authInstance = getAuth(app);
    console.log('✅ Firebase Auth initialized');
  }
  return authInstance;
};