import { DatabaseService } from '../base/DatabaseService';
import { TimeExperience } from '../../types';
import { collection, addDoc, query, where, getDocs, runTransaction } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { availabilityService } from '../availability/AvailabilityService';

class ExperienceService extends DatabaseService<TimeExperience> {
  private static instance: ExperienceService;

  private constructor() {
    super('experiences');
  }

  public static getInstance(): ExperienceService {
    if (!ExperienceService.instance) {
      ExperienceService.instance = new ExperienceService();
    }
    return ExperienceService.instance;
  }

  async createExperience(userId: string, data: Omit<TimeExperience, 'id'> & { availability: any[] }): Promise<string> {
    try {
      // Utiliser une transaction pour garantir l'atomicité
      const experienceId = await runTransaction(db, async (transaction) => {
        // 1. Créer l'expérience
        const experienceData = {
          ...data,
          userId,
          createdAt: new Date(),
          status: 'active'
        };
        
        const docRef = await addDoc(collection(db, 'experiences'), experienceData);

        // 2. Sauvegarder les disponibilités
        const availabilityData = {
          experienceId: docRef.id,
          hostId: userId,
          slots: data.availability.map(slot => ({
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime,
            available: true
          }))
        };

        await availabilityService.saveExperienceAvailability(docRef.id, availabilityData);

        return docRef.id;
      });

      return experienceId;
    } catch (error) {
      console.error('Error creating experience:', error);
      throw new Error('Failed to create experience');
    }
  }

  async getUserExperiences(userId: string): Promise<TimeExperience[]> {
    try {
      const q = query(
        collection(db, 'experiences'),
        where('userId', '==', userId),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      const experiences = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const experience = { id: doc.id, ...doc.data() } as TimeExperience;
          // Charger les disponibilités pour chaque expérience
          const availability = await availabilityService.getExperienceAvailability(doc.id);
          return {
            ...experience,
            availability: availability?.slots || []
          };
        })
      );
      
      return experiences;
    } catch (error) {
      console.error('Error fetching user experiences:', error);
      throw new Error('Failed to fetch experiences');
    }
  }

  async getAllExperiences(): Promise<TimeExperience[]> {
    try {
      const q = query(
        collection(db, 'experiences'),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      const experiences = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const experience = { id: doc.id, ...doc.data() } as TimeExperience;
          // Charger les disponibilités pour chaque expérience
          const availability = await availabilityService.getExperienceAvailability(doc.id);
          return {
            ...experience,
            availability: availability?.slots || []
          };
        })
      );
      
      return experiences;
    } catch (error) {
      console.error('Error fetching all experiences:', error);
      throw new Error('Failed to fetch experiences');
    }
  }
}

export const experienceService = ExperienceService.getInstance();