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
  status: 'available' | 'cancelled' | 'booked';
  createdAt: Date;
}

class AvailabilityService {
  private readonly COLLECTION = 'disponibilites';
  // Exemple de méthode pour obtenir les disponibilités pour une expérience
  async getExperienceAvailabilities(experienceId: string): Promise<Availability[]> {
    // Logique pour récupérer les disponibilités liées à une expérience
    const response = await fetch(`/api/availabilities?experienceId=${experienceId}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des disponibilités.');
    }
    return response.json();  // Suppose que la réponse de l'API est un tableau de disponibilités
  }
  async createAvailability(data: {
    userId: string;
    experienceId: string;
    date: Date;
    startTime: string;
    endTime: string;
  }): Promise<void> {
    try {
      const { userId, experienceId, date, startTime, endTime } = data;
      const availability = {
        userId,
        experienceId,
        date: Timestamp.fromDate(date),
        startTime,
        endTime,
        status: 'active',
        createdAt: Timestamp.fromDate(new Date())
      };

      await addDoc(collection(db, this.COLLECTION), availability);
      console.log('✅ Disponibilité créée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la création de la disponibilité:', error);
      throw new Error('Impossible de créer la disponibilité');
    }
  }

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
  async getUserAvailabilities(userId: string): Promise<Availability[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      const availabilities: Availability[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        availabilities.push({
          id: doc.id,
          userId: data.userId,
          experienceId: data.experienceId,
          date: data.date.toDate(),
          startTime: data.startTime,
          endTime: data.endTime,
          status: data.status,
          createdAt: data.createdAt.toDate(),
        });
      });

      console.log('✅ Disponibilités récupérées avec succès');
      return availabilities;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des disponibilités:', error);
      throw new Error('Impossible de récupérer les disponibilités');
    }
  }
}

export const availabilityService = new AvailabilityService();