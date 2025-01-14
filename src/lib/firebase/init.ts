import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from '../../config/firebase.config';

class FirebaseInitializer {
  private static instance: FirebaseInitializer;
  private app: FirebaseApp;
  private initialized = false;

  private constructor() {
    if (getApps().length === 0) {
      this.app = initializeApp(firebaseConfig);
    } else {
      this.app = getApps()[0];
    }
  }

  public static getInstance(): FirebaseInitializer {
    if (!FirebaseInitializer.instance) {
      FirebaseInitializer.instance = new FirebaseInitializer();
    }
    return FirebaseInitializer.instance;
  }

  public async initialize() {
    if (this.initialized) return;

    try {
      const auth = getAuth(this.app);
      const db = getFirestore(this.app);

      // Enable offline persistence
      try {
        await enableIndexedDbPersistence(db);
      } catch (err: any) {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence enabled in first tab only');
        } else if (err.code === 'unimplemented') {
          console.warn('Browser doesn\'t support persistence');
        }
      }

      this.initialized = true;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }

  public getApp(): FirebaseApp {
    return this.app;
  }
}

// Initialize Firebase immediately
const initializer = FirebaseInitializer.getInstance();
await initializer.initialize();

export const initializeFirebase = () => initializer.getApp();