import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, Timestamp, runTransaction } from 'firebase/firestore';
import { Booking } from '../types/booking';
import { BaseService } from './base/BaseService';
import { transactionService } from './transaction/transactionService';

class BookingService extends BaseService {
  private readonly COLLECTION = 'bookings';

  async createBooking(data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.withAuth(async () => {
      try {
        const now = new Date();
        const docRef = await addDoc(collection(db, this.COLLECTION), {
          ...data,
          status: 'pending',
          createdAt: now,
          updatedAt: now,
          timeSlot: {
            startTime: Timestamp.fromDate(data.timeSlot.startTime),
            endTime: Timestamp.fromDate(data.timeSlot.endTime)
          }
        });
        return docRef.id;
      } catch (error) {
        console.error('Error creating booking:', error);
        throw error instanceof Error ? error : new Error('Failed to create booking');
      }
    });
  }

  async confirmBooking(bookingId: string): Promise<void> {
    return this.withAuth(async () => {
      try {
        await runTransaction(db, async (transaction) => {
          const bookingRef = doc(db, this.COLLECTION, bookingId);
          const bookingDoc = await transaction.get(bookingRef);

          if (!bookingDoc.exists()) {
            throw new Error('Booking not found');
          }

          const booking = bookingDoc.data() as Booking;
          
          if (booking.status !== 'pending') {
            throw new Error('This booking cannot be confirmed');
          }

          // First transfer the time
          await transactionService.transferTime({
            fromUserId: booking.guestUserId,
            toUserId: booking.hostUserId,
            amount: booking.duration,
            bookingId: bookingId,
            experienceId: booking.experienceId
          });

          // Then update booking status
          transaction.update(bookingRef, {
            status: 'confirmed',
            updatedAt: Timestamp.fromDate(new Date())
          });
        });
      } catch (error) {
        console.error('Error confirming booking:', error);
        throw error instanceof Error ? error : new Error('Failed to confirm booking');
      }
    });
  }

  async cancelBooking(bookingId: string): Promise<void> {
    return this.withAuth(async () => {
      try {
        const bookingRef = doc(db, this.COLLECTION, bookingId);
        await updateDoc(bookingRef, {
          status: 'cancelled',
          updatedAt: Timestamp.fromDate(new Date())
        });
      } catch (error) {
        console.error('Error cancelling booking:', error);
        throw error instanceof Error ? error : new Error('Failed to cancel booking');
      }
    });
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.withAuth(async () => {
      try {
        const [guestBookings, hostBookings] = await Promise.all([
          this.getBookingsByRole(userId, 'guestUserId'),
          this.getBookingsByRole(userId, 'hostUserId')
        ]);

        return [...guestBookings, ...hostBookings].sort((a, b) => 
          b.timeSlot.startTime.getTime() - a.timeSlot.startTime.getTime()
        );
      } catch (error) {
        console.error('Error loading bookings:', error);
        throw new Error('Unable to load bookings');
      }
    });
  }

  private async getBookingsByRole(userId: string, role: 'guestUserId' | 'hostUserId'): Promise<Booking[]> {
    const q = query(collection(db, this.COLLECTION), where(role, '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timeSlot: {
        startTime: doc.data().timeSlot.startTime.toDate(),
        endTime: doc.data().timeSlot.endTime.toDate()
      },
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Booking[];
  }
}

export const bookingService = new BookingService();