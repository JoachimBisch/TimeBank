import { db } from '../lib/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';

export async function creditAllUsers(): Promise<void> {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const batch = writeBatch(db);
    
    snapshot.docs.forEach(doc => {
      const currentBalance = doc.data().timeBalance || 0;
      batch.update(doc.ref, { 
        timeBalance: currentBalance + 3,
        updatedAt: new Date()
      });
    });

    await batch.commit();
    console.log(`✅ ${snapshot.size} users have been credited with 3 hours`);
  } catch (error) {
    console.error('❌ Error crediting users:', error);
    throw error;
  }
}

// Make it available globally for console access
(window as any).creditAllUsers = creditAllUsers;