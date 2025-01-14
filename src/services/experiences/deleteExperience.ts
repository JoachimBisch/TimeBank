import { db } from '../../lib/firebase';
import { doc, writeBatch, Timestamp } from 'firebase/firestore';
import { getExperienceAvailabilities } from './queries';

export async function deleteExperience(experienceId: string): Promise<void> {
  if (!experienceId) {
    throw new Error('Experience ID is required');
  }

  const batch = writeBatch(db);

  try {
    // 1. Mark experience as deleted
    const experienceRef = doc(db, 'experiences', experienceId);
    batch.update(experienceRef, {
      status: 'deleted',
      updatedAt: Timestamp.fromDate(new Date())
    });

    // 2. Cancel all related availabilities
    const availabilities = await getExperienceAvailabilities(experienceId);
    availabilities.forEach(doc => {
      batch.update(doc.ref, {
        status: 'cancelled',
        updatedAt: Timestamp.fromDate(new Date())
      });
    });

    // 3. Commit all changes
    await batch.commit();
  } catch (error) {
    console.error('Error in deleteExperience:', error);
    throw new Error('Failed to delete experience');
  }
}