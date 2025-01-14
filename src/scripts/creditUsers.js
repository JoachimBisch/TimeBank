import { db } from '../lib/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';

async function creditAllUsers() {
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
    console.log(`✅ ${snapshot.size} utilisateurs ont reçu 3 heures`);
  } catch (error) {
    console.error('❌ Erreur lors du crédit des utilisateurs:', error);
    throw error;
  }
}

creditAllUsers().catch(console.error);