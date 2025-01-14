import React from 'react';
import { Check, X, Clock, User } from 'lucide-react';
import { Booking } from '../../../types/booking';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingCardProps {
  booking: Booking;
  onStatusUpdate?: (bookingId: string, action: 'confirm' | 'cancel') => Promise<void>;
  isProcessing?: boolean;
  isHost: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onStatusUpdate,
  isProcessing,
  isHost
}) => {
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{booking.experienceTitle}</h4>
          <div className="mt-1 space-y-1">
            <p className="text-sm text-gray-500 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {format(booking.timeSlot.startTime, 'EEEE d MMMM à HH:mm', { locale: fr })}
            </p>
            {!isHost && booking.hostUser && (
              <p className="text-sm text-gray-500 flex items-center">
                <User className="w-4 h-4 mr-1" />
                Animé par {booking.hostUser.firstName} {booking.hostUser.lastName}
              </p>
            )}
            {isHost && booking.guestUser && (
              <p className="text-sm text-gray-500 flex items-center">
                <User className="w-4 h-4 mr-1" />
                Réservé par {booking.guestUser.firstName} {booking.guestUser.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {booking.status === 'pending' && isHost && (
            <>
              <button
                onClick={() => onStatusUpdate?.(booking.id, 'confirm')}
                disabled={isProcessing}
                className="text-green-600 hover:text-green-800 disabled:opacity-50"
                title="Confirmer"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => onStatusUpdate?.(booking.id, 'cancel')}
                disabled={isProcessing}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                title="Refuser"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(booking.status)}`}>
            {getStatusText(booking.status)}
          </span>
        </div>
      </div>
    </div>
  );
};