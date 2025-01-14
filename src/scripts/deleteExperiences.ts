import { db } from '../lib/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';

async function deleteAllExperiences() {
  try {
    // Get all experiences
    const experiencesRef = collection(db, 'experiences');
    const experiencesSnapshot = await getDocs(experiencesRef);
    
    // Get all availabilities
    const availabilitiesRef = collection(db, 'disponibilites');
    const availabilitiesSnapshot = await getDocs(availabilitiesRef);
    
    // Use batch to delete everything
    const batch = writeBatch(db);
    
    // Mark experiences as deleted
    experiencesSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        status: 'deleted',
        updatedAt: new Date()
      });
    });
    
    // Cancel all availabilities
    availabilitiesSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        status: 'cancelled',
        updatedAt: new Date()
      });
    });

    await batch.commit();
    
    console.log(`✅ Successfully deleted:
      - ${experiencesSnapshot.size} experiences
      - ${availabilitiesSnapshot.size} availabilities`);
  } catch (error) {
    console.error('❌ Error deleting experiences:', error);
    throw error;
  }
}

// Export for use in browser console
(window as any).deleteAllExperiences = deleteAllExperiences;