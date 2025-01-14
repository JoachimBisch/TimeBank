import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCUVNvXtXyS73aX0VU8EP0M47QIhOoJi8k",
  authDomain: "timebank-122bc.firebaseapp.com",
  projectId: "timebank-122bc",
  storageBucket: "timebank-122bc.firebasestorage.app",
  messagingSenderId: "331743621517",
  appId: "1:331743621517:web:8d8a6174b14d4fe852cdc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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