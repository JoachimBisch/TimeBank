import { DatabaseService } from '../base/DatabaseService';
import { User } from '../../types';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

class UserService extends DatabaseService<User> {
  private static instance: UserService;
  private readonly COLLECTION = 'users';

  private constructor() {
    super('users');
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUserProfile(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, this.COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async createInitialUserProfile(userId: string, email: string): Promise<void> {
    try {
      const initialUserData: Omit<User, 'id'> = {
        email,
        name: email.split('@')[0],
        timeBalance: 3,
        rating: 5,
        ratingCount: 1,
        exchangedHours: 0,
        skills: [],
        createdAt: new Date().toISOString()
      };

      const docRef = doc(db, this.COLLECTION, userId);
      await setDoc(docRef, initialUserData);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }
}

export const userService = UserService.getInstance();