import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from '../types';

interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
}

class UserService {
  private readonly COLLECTION = 'users';
  private cache = new Map<string, { data: User; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getUserProfile(userId: string): Promise<User | null> {
    if (!userId) return null;
    
    try {
      // Check cache first
      const cached = this.cache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data;
      }

      const userRef = doc(db, this.COLLECTION, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        this.cache.set(userId, { data: userData, timestamp: Date.now() });
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async createInitialUserProfile(userId: string, data: CreateUserData): Promise<void> {
    if (!userId || !data.email) throw new Error('UserId and email are required');

    try {
      const userRef = doc(db, this.COLLECTION, userId);
      
      const initialUserData: Omit<User, 'id'> = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        timeBalance: 3,
        rating: 5,
        ratingCount: 1,
        exchangedHours: 0,
        exchangesCount: 0,
        skills: [],
        createdAt: new Date().toISOString()
      };

      await setDoc(userRef, initialUserData);
      
      // Update cache
      this.cache.set(userId, {
        data: { id: userId, ...initialUserData },
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  clearCache(userId?: string) {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }
}

export const userService = new UserService();