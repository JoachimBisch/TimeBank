import { db } from '../../lib/firebase';
import { collection, addDoc, runTransaction, doc, updateDoc } from 'firebase/firestore';
import { BaseService } from '../base/BaseService';
import { TimeTransaction, TransferTimeParams } from './types';

class TransactionService extends BaseService {
  private readonly COLLECTION = 'transactions';
  private readonly USERS_COLLECTION = 'users';

  async transferTime({
    fromUserId,
    toUserId,
    amount,
    bookingId,
    experienceId
  }: TransferTimeParams): Promise<string> {
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount for time transfer');
    }

    return this.withAuth(async () => {
      try {
        const now = new Date();
        
        const transactionRef = await addDoc(collection(db, this.COLLECTION), {
          fromUserId,
          toUserId,
          amount,
          bookingId,
          experienceId,
          type: 'booking',
          status: 'pending',
          createdAt: now,
          updatedAt: now
        } as TimeTransaction);

        await runTransaction(db, async (transaction) => {
          const fromUserRef = doc(db, this.USERS_COLLECTION, fromUserId);
          const toUserRef = doc(db, this.USERS_COLLECTION, toUserId);
          
          const [fromUserDoc, toUserDoc] = await Promise.all([
            transaction.get(fromUserRef),
            transaction.get(toUserRef)
          ]);

          if (!fromUserDoc.exists() || !toUserDoc.exists()) {
            throw new Error('One or both users not found');
          }

          const fromUserData = fromUserDoc.data();
          const toUserData = toUserDoc.data();

          const fromBalance = fromUserData.timeBalance || 0;
          const toBalance = toUserData.timeBalance || 0;

          if (fromBalance < amount) {
            throw new Error(`Not enough balance: ${fromBalance}h available, ${amount}h needed`);
          }

          transaction.update(fromUserRef, {
            timeBalance: fromBalance - amount,
            exchangedHours: (fromUserData.exchangedHours || 0) + amount,
            exchangesCount: (fromUserData.exchangesCount || 0) + 1,
            updatedAt: now
          });

          transaction.update(toUserRef, {
            timeBalance: toBalance + amount,
            exchangedHours: (toUserData.exchangedHours || 0) + amount,
            exchangesCount: (toUserData.exchangesCount || 0) + 1,
            updatedAt: now
          });

          transaction.update(transactionRef, {
            status: 'completed',
            updatedAt: now
          });
        });

        return transactionRef.id;
      } catch (error) {
        console.error('Transaction error:', error);
        throw error instanceof Error ? error : new Error('Failed to transfer time');
      }
    });
  }
}

export const transactionService = new TransactionService();