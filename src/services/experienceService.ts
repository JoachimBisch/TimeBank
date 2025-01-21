import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { TimeExperience } from '../types';
import { BaseService } from './base/BaseService';

class ExperienceService extends BaseService {
  private readonly COLLECTION = 'experiences';

  async createExperience(experience: Omit<TimeExperience, 'id'>): Promise<string> {
    return this.withAuth(async () => {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...experience,
        createdAt: new Date(),
        status: 'active'
      });
      return docRef.id;
    });
  }

  async getUserExperiences(userId: string): Promise<TimeExperience[]> {
    return this.withAuth(async () => {
      try {
        const q = query(
          collection(db, this.COLLECTION),
          where('userId', '==', userId),
          where('status', '==', 'active')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as TimeExperience));
      } catch (error) {
        console.error('❌ Error fetching user experiences:', error);
        throw new Error('Failed to fetch user experiences. Please try again later.');
      }
    });
  }

  async getAllExperiences(): Promise<TimeExperience[]> {
    return this.withAuth(async () => {
      const q = query(
        collection(db, this.COLLECTION),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as TimeExperience));
    });
  }

  async deleteExperience(id: string): Promise<void> {
    return this.withAuth(async () => {
      const docRef = doc(db, this.COLLECTION, id);
      await updateDoc(docRef, {
        status: 'deleted',
        updatedAt: new Date()
      });
    });
  }
}

export const experienceService = new ExperienceService();