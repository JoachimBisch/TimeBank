import React, { useState } from 'react';
import { X, Clock, MapPin, Users } from 'lucide-react';
import { TimeExperience } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';
import { ExperienceAvailabilityCalendar } from '../experiences/ExperienceAvailabilityCalendar';
import { ErrorMessage } from '../ui/ErrorMessage';

interface BookingModalProps {
  experience: TimeExperience;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  experience,
  isOpen,
  onClose
}) => {
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    startTime: string;
    endTime: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTimeSlotSelect = (slot: { date: Date; startTime: string; endTime: string }) => {
    setError(null);
    setSelectedSlot(slot);
  };

  const canBook = Boolean(
    selectedSlot && 
    !isSubmitting && 
    user?.uid !== experience.userId &&
    userProfile?.timeBalance >= experience.duration
  );

  const handleBooking = async () => {
    if (!user || !userProfile || !selectedSlot) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const startTime = new Date(`${selectedSlot.date.toISOString().split('T')[0]}T${selectedSlot.startTime}`);
      const endTime = new Date(`${selectedSlot.date.toISOString().split('T')[0]}T${selectedSlot.endTime}`);

      await bookingService.createBooking({
        experienceId: experience.id,
        experienceTitle: experience.title,
        hostUserId: experience.userId,
        guestUserId: user.uid,
        timeSlot: { startTime, endTime },
        duration: experience.duration,
        status: 'pending'
      });

      setSuccessMessage('Réservation effectuée avec succès !');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Create booking error:', err);
      setError(err instanceof Error ? err.message : 'Impossible de finaliser la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Réserver {experience.title}
              </h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium">Durée : {experience.duration}h</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Votre solde : {userProfile?.timeBalance || 0}h
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {experience.minParticipants}-{experience.maxParticipants} pers.
                  </div>
                  {experience.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {experience.location}
                    </div>
                  )}
                </div>
              </div>

              {error && <ErrorMessage message={error} />}
              {successMessage && (
                <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
                  {successMessage}
                </div>
              )}

              <div className="mb-6">
                <ExperienceAvailabilityCalendar
                  experience={experience}
                  isOwner={user?.uid === experience.userId}
                  onTimeSlotSelect={handleTimeSlotSelect}
                />
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={!canBook || isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Réservation...' : 'Confirmer la réservation'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};