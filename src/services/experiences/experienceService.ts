import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, Timestamp, writeBatch } from 'firebase/firestore';
import { TimeExperience } from '../../types';
import { BaseService } from '../base/BaseService';
import { CreateExperienceInput, CreateExperienceData } from './types';
import { validateExperienceInput } from './validation';
import { availabilityService } from '../availability/availabilityService';

class ExperienceService extends BaseService {
  private readonly COLLECTION = 'experiences';

  async createExperience(input: CreateExperienceInput): Promise<string> {
    return this.withAuth(async () => {
      try {
        // Validate input
        validateExperienceInput(input);

        const userId = await this.requireAuth();
        
        // Create experience data
        const experienceData: CreateExperienceData = {
          ...input,
          userId,
          status: 'active',
          createdAt: new Date()
        };

        // Create experience document
        const docRef = await addDoc(collection(db, this.COLLECTION), experienceData);
        
        return docRef.id;
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  async getAllExperiences(): Promise<TimeExperience[]> {
    return this.withAuth(async () => {
      try {
        const userId = await this.requireAuth();
        
        const q = query(
          collection(db, this.COLLECTION),
          where('status', '==', 'active')
        );
        
        const snapshot = await getDocs(q);
        
        return snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt instanceof Timestamp 
              ? doc.data().createdAt.toDate() 
              : new Date(doc.data().createdAt)
          }))
          .filter(exp => exp.userId !== userId) as TimeExperience[];
      } catch (error) {
        throw this.handleError(error);
      }
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
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt instanceof Timestamp 
            ? doc.data().createdAt.toDate() 
            : new Date(doc.data().createdAt)
        })) as TimeExperience[];
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  async deleteExperience(experienceId: string): Promise<void> {
    return this.withAuth(async () => {
      try {
        const batch = writeBatch(db);
        
        // Mark experience as deleted
        const experienceRef = doc(db, this.COLLECTION, experienceId);
        batch.update(experienceRef, {
          status: 'deleted',
          updatedAt: Timestamp.fromDate(new Date())
        });

        // Cancel related availabilities
        const availabilities = await availabilityService.getExperienceAvailabilities(experienceId);
        availabilities.forEach(availability => {
          const availabilityRef = doc(db, 'disponibilites', availability.id);
          batch.update(availabilityRef, {
            status: 'cancelled',
            updatedAt: Timestamp.fromDate(new Date())
          });
        });

        // Commit all changes
        await batch.commit();
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }
}

export const experienceService = new ExperienceService();