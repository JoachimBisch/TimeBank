import { db } from '../../lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function creditAllUsers(amount: number = 3): Promise<void> {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const updates = snapshot.docs.map(async (userDoc) => {
      const userRef = doc(db, 'users', userDoc.id);
      const currentBalance = userDoc.data().timeBalance || 0;
      
      await updateDoc(userRef, {
        timeBalance: currentBalance + amount
      });
    });

    await Promise.all(updates);
    console.log(`✅ Successfully credited ${amount} hours to ${snapshot.size} users`);
  } catch (error) {
    console.error('❌ Error crediting users:', error);
    throw error;
  }
}