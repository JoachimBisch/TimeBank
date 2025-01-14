import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';

export async function getExperienceAvailabilities(experienceId: string): Promise<QueryDocumentSnapshot[]> {
  const availabilitiesQuery = query(
    collection(db, 'disponibilites'),
    where('experienceId', '==', experienceId),
    where('status', '==', 'active')
  );
  
  const snapshot = await getDocs(availabilitiesQuery);
  return snapshot.docs;
}