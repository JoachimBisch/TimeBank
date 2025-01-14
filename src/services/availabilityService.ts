import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { UserAvailability, AvailabilitySlot } from '../types/availability';
import { TimeSlot } from '../types/booking';
import { addDays, format, parse, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

class AvailabilityService {
  private readonly COLLECTION = 'availabilities';
  private readonly SLOTS_COLLECTION = 'availability_slots';

  async saveUserAvailability(userId: string, availability: Omit<UserAvailability, 'userId' | 'lastUpdated'>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, userId);
      await setDoc(docRef, {
        userId,
        ...availability,
        lastUpdated: new Date()
      });

      // Générer et sauvegarder les créneaux disponibles
      await this.generateAndSaveAvailabilitySlots(userId, availability);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des disponibilités:', error);
      throw new Error('Impossible de sauvegarder les disponibilités');
    }
  }

  async getUserAvailability(userId: string): Promise<UserAvailability | null> {
    try {
      const docRef = doc(db, this.COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserAvailability;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des disponibilités:', error);
      throw new Error('Impossible de récupérer les disponibilités');
    }
  }

  async getAvailableSlotsForExperience(experienceId: string, hostId: string, startDate: Date, endDate: Date): Promise<AvailabilitySlot[]> {
    try {
      const q = query(
        collection(db, this.SLOTS_COLLECTION),
        where('hostId', '==', hostId),
        where('experienceId', '==', experienceId),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        date: doc.data().date.toDate()
      })) as AvailabilitySlot[];
    } catch (error) {
      console.error('Erreur lors de la récupération des créneaux:', error);
      throw new Error('Impossible de récupérer les créneaux disponibles');
    }
  }

  private async generateAndSaveAvailabilitySlots(
    userId: string, 
    availability: Omit<UserAvailability, 'userId' | 'lastUpdated'>
  ): Promise<void> {
    const startDate = new Date();
    const endDate = addDays(startDate, 30); // Générer pour les 30 prochains jours
    const slots: AvailabilitySlot[] = [];

    let currentDate = startDate;
    while (currentDate <= endDate) {
      const dayOfWeek = format(currentDate, 'EEEE', { locale: fr }).toLowerCase();
      const daySchedule = availability.weeklySchedule[dayOfWeek];

      if (daySchedule?.available) {
        // Vérifier les exceptions
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        const exception = availability.exceptions.find(e => e.date === dateStr);

        if (!exception || (exception.type === 'available' && exception.slots)) {
          const timeSlots = (exception?.type === 'available' ? exception.slots : daySchedule.slots)
            .map(slot => ({
              startTime: parse(slot.start, 'HH:mm', currentDate),
              endTime: parse(slot.end, 'HH:mm', currentDate)
            }));

          slots.push({
            date: currentDate,
            timeSlots,
            hostId: userId,
            experienceId: '' // À remplir lors de la création d'une expérience
          });
        }
      }

      currentDate = addDays(currentDate, 1);
    }

    // Sauvegarder les créneaux générés
    for (const slot of slots) {
      const slotId = `${userId}_${format(slot.date, 'yyyy-MM-dd')}`;
      await setDoc(doc(db, this.SLOTS_COLLECTION, slotId), slot);
    }
  }

  async linkAvailabilityToExperience(userId: string, experienceId: string): Promise<void> {
    try {
      const q = query(
        collection(db, this.SLOTS_COLLECTION),
        where('hostId', '==', userId),
        where('experienceId', '==', '')
      );

      const querySnapshot = await getDocs(q);
      const batch = db.batch();

      querySnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { experienceId });
      });

      await batch.commit();
    } catch (error) {
      console.error('Erreur lors de la liaison des disponibilités:', error);
      throw new Error('Impossible de lier les disponibilités à l\'expérience');
    }
  }
}

export const availabilityService = new AvailabilityService();