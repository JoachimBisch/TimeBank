import { db } from '../../lib/firebase';
import { collection, doc, getDoc, getDocs, query, QueryConstraint, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export abstract class FirestoreService<T extends { id?: string }> {
  protected constructor(
    protected readonly collectionName: string
  ) {}

  protected async getDocument(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du document ${id}:`, error);
      throw error;
    }
  }

  protected async queryDocuments(constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      throw error;
    }
  }

  protected async setDocument(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde du document ${id}:`, error);
      throw error;
    }
  }

  protected async updateDocument(id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du document ${id}:`, error);
      throw error;
    }
  }

  protected async deleteDocument(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Erreur lors de la suppression du document ${id}:`, error);
      throw error;
    }
  }
}