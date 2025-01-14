import React, { useEffect, useState } from 'react';
import { availabilityService } from '../../services/availability/availabilityService';
import { Availability } from '../../services/availability/types';
import { BookingCalendar } from './BookingCalendar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';

interface BookExperienceProps {
  experienceId: string;
  onBookingComplete?: () => void;
}

export const BookExperience: React.FC<BookExperienceProps> = ({ 
  experienceId,
  onBookingComplete 
}) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAvailabilities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await availabilityService.getExperienceAvailabilities(experienceId);
        setAvailabilities(data);
      } catch (err) {
        console.error('Erreur lors du chargement des disponibilités:', err);
        setError('Impossible de charger les disponibilités. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadAvailabilities();
  }, [experienceId]);

  const handleTimeSlotSelect = async (availability: Availability) => {
    try {
      // Here you would typically create a booking
      await availabilityService.updateAvailabilityStatus(availability.id, 'booked');
      onBookingComplete?.();
    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      setError('Impossible de finaliser la réservation. Veuillez réessayer.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (availabilities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Aucune disponibilité pour cette expérience
        </p>
      </div>
    );
  }

  return (
    <BookingCalendar
      availabilities={availabilities}
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      onTimeSlotSelect={handleTimeSlotSelect}
    />
  );
};