import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { bookingService } from '../../../services/bookingService';
import { Booking } from '../../../types/booking';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { ErrorMessage } from '../../ui/ErrorMessage';
import { BookingsList } from './BookingsList';

export const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadBookings = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const userBookings = await bookingService.getUserBookings(user.uid);
      setBookings(userBookings);
    } catch (err) {
      setError('Unable to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      loadBookings();
    }
  }, [user?.uid]);

  const handleStatusUpdate = async (bookingId: string, action: 'confirm' | 'cancel') => {
    try {
      setProcessingId(bookingId);
      setError(null);

      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.hostUserId !== user?.uid) {
        throw new Error('Only the host can update booking status');
      }

      if (action === 'confirm') {
        await bookingService.confirmBooking(bookingId, booking.experienceId, booking.duration);
      } else {
        await bookingService.cancelBooking(bookingId);
      }

      await loadBookings();
    } catch (err) {
      console.error('Status update error:', err);
      setError(err instanceof Error ? err.message : `Failed to ${action} booking`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const now = new Date();
  const hostedBookings = bookings.filter(b => b.hostUserId === user?.uid);
  const attendedBookings = bookings.filter(b => b.guestUserId === user?.uid);

  return (
    <div className="space-y-8">
      {hostedBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Sessions que vous animez</h2>
          <BookingsList
            bookings={hostedBookings.filter(b => 
              b.timeSlot.startTime > now && 
              b.status !== 'cancelled'
            )}
            title="À venir"
            listType="upcoming"
            onStatusUpdate={handleStatusUpdate}
            isProcessing={!!processingId}
            isHost={true}
          />
          <BookingsList
            bookings={hostedBookings.filter(b => 
              b.timeSlot.startTime <= now || 
              b.status === 'cancelled'
            )}
            title="Passées"
            listType="past"
            isHost={true}
          />
        </div>
      )}

      {attendedBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Sessions auxquelles vous participez</h2>
          <BookingsList
            bookings={attendedBookings.filter(b => 
              b.timeSlot.startTime > now && 
              b.status !== 'cancelled'
            )}
            title="À venir"
            listType="upcoming"
            isHost={false}
          />
          <BookingsList
            bookings={attendedBookings.filter(b => 
              b.timeSlot.startTime <= now || 
              b.status === 'cancelled'
            )}
            title="Passées"
            listType="past"
            isHost={false}
          />
        </div>
      )}

      {bookings.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-gray-500">Aucune réservation trouvée</p>
        </div>
      )}
    </div>
  );
};