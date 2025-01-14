import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig, validateFirebaseConfig } from '../../config/firebase.config';

class FirebaseCore {
  private static instance: FirebaseCore;
  private app: FirebaseApp;
  private auth: Auth;
  private db: Firestore;

  private constructor() {
    validateFirebaseConfig();
    
    if (getApps().length === 0) {
      console.log('🔥 Initializing new Firebase app...');
      this.app = initializeApp(firebaseConfig);
    } else {
      console.log('♻️ Using existing Firebase app');
      this.app = getApps()[0];
    }

    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  public static getInstance(): FirebaseCore {
    if (!FirebaseCore.instance) {
      FirebaseCore.instance = new FirebaseCore();
    }
    return FirebaseCore.instance;
  }

  public getAuth(): Auth {
    return this.auth;
  }

  public getDb(): Firestore {
    return this.db;
  }
}

const firebaseCore = FirebaseCore.getInstance();
export const auth = firebaseCore.getAuth();
export const db = firebaseCore.getDb();