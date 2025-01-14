import React from 'react';
import { Booking } from '../../../types/booking';
import { BookingCard } from './BookingCard';

interface BookingsListProps {
  bookings: Booking[];
  title: string;
  listType: 'upcoming' | 'past';
  onStatusUpdate?: (bookingId: string, action: 'confirm' | 'cancel') => Promise<void>;
  isProcessing?: boolean;
  isHost?: boolean;
}

export const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  title,
  listType,
  onStatusUpdate,
  isProcessing,
  isHost
}) => {
  if (bookings.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-4">
        {bookings.map(booking => (
          <BookingCard
            key={`${booking.id}-${booking.status}-${listType}`}
            booking={booking}
            onStatusUpdate={onStatusUpdate}
            isProcessing={isProcessing}
            isHost={isHost}
          />
        ))}
      </div>
    </div>
  );
};