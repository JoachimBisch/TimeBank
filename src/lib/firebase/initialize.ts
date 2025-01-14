import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../config/firebase';

class FirebaseInitializer {
  private static instance: FirebaseInitializer;
  private app;
  private analytics;
  private auth;
  private db;

  private constructor() {
    if (getApps().length === 0) {
      this.app = initializeApp(firebaseConfig);
    } else {
      this.app = getApps()[0];
    }
    
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  public static getInstance() {
    if (!FirebaseInitializer.instance) {
      FirebaseInitializer.instance = new FirebaseInitializer();
    }
    return FirebaseInitializer.instance;
  }

  public getAuth() {
    return this.auth;
  }

  public getDb() {
    return this.db;
  }

  public getAnalytics() {
    return this.analytics;
  }
}

const firebase = FirebaseInitializer.getInstance();

export const auth = firebase.getAuth();
export const db = firebase.getDb();
export const analytics = firebase.getAnalytics();