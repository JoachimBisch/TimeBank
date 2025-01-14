import { db } from '../../lib/firebase';
import { collection, doc, getDoc, getDocs, query, QueryConstraint, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export abstract class DatabaseService<T extends { id?: string }> {
  protected constructor(
    protected readonly collectionName: string,
    private readonly cacheTimeout: number = 5 * 60 * 1000 // 5 minutes par défaut
  ) {}

  private cache = new Map<string, { data: T; timestamp: number }>();

  protected async getDocument(id: string, bypassCache = false): Promise<T | null> {
    try {
      // Check cache first if not bypassing
      if (!bypassCache) {
        const cached = this.cache.get(id);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as T;
        this.cache.set(id, { data, timestamp: Date.now() });
        return data;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching document ${id}:`, error);
      throw error;
    }
  }

  protected async setDocument(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date()
      }, { merge: true });
      
      // Invalidate cache
      this.cache.delete(id);
    } catch (error) {
      console.error(`Error setting document ${id}:`, error);
      throw error;
    }
  }

  protected async updateDocument(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      
      // Invalidate cache
      this.cache.delete(id);
    } catch (error) {
      console.error(`Error updating document ${id}:`, error);
      throw error;
    }
  }

  protected async deleteDocument(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      
      // Invalidate cache
      this.cache.delete(id);
    } catch (error) {
      console.error(`Error deleting document ${id}:`, error);
      throw error;
    }
  }

  protected clearCache(id?: string): void {
    if (id) {
      this.cache.delete(id);
    } else {
      this.cache.clear();
    }
  }
}