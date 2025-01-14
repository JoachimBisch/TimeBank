import { db } from '../../lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { TimeSlot } from '../../types/booking';

interface Availability {
  id: string;
  userId: string;
  experienceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'active' | 'cancelled' | 'booked';
  createdAt: Date;
}

class AvailabilityService {
  private readonly COLLECTION = 'disponibilites';

  async deleteAvailability(availabilityId: string): Promise<void> {
    try {
      const availabilityRef = doc(db, this.COLLECTION, availabilityId);
      await deleteDoc(availabilityRef);
      console.log('✅ Disponibilité supprimée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      throw new Error('Impossible de supprimer la disponibilité');
    }
  }

  async updateAvailabilityStatus(availabilityId: string, newStatus: Availability['status']): Promise<void> {
    try {
      const availabilityRef = doc(db, this.COLLECTION, availabilityId);
      await updateDoc(availabilityRef, { 
        status: newStatus,
        updatedAt: Timestamp.fromDate(new Date())
      });
      console.log('✅ Statut de la disponibilité mis à jour avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      throw new Error('Impossible de mettre à jour le statut de la disponibilité');
    }
  }

  // ... rest of the existing code ...
}

export const availabilityService = new AvailabilityService();