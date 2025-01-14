import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '../calendar/Calendar';
import { TimeSlotPicker } from './TimeSlotPicker';
import { availabilityService } from '../../services/availability/availabilityService';
import { experienceService } from '../../services/experiences/experienceService';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { TimeExperience } from '../../types';

export const AvailabilityCalendar: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availabilities, setAvailabilities] = useState<Array<{ date: Date; slots: string[] }>>([]);
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<TimeExperience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadExperiences = async () => {
      if (!user?.uid) return;
      
      try {
        const userExperiences = await experienceService.getUserExperiences(user.uid);
        setExperiences(userExperiences);
      } catch (err) {
        setError('Impossible de charger vos expériences');
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, [user?.uid]);

  const handleTimeSlotSelect = async (time: { startTime: string; endTime: string }) => {
    if (!selectedDate || !user?.uid || !selectedExperience) {
      setError('Veuillez sélectionner une expérience et une date');
      return;
    }

    try {
      setError(null);
      await availabilityService.createAvailability({
        userId: user.uid,
        experienceId: selectedExperience,
        date: selectedDate,
        startTime: time.startTime,
        endTime: time.endTime
      });

      setAvailabilities(prev => {
        const existingDateIndex = prev.findIndex(a => 
          format(a.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
        );

        if (existingDateIndex >= 0) {
          const newAvailabilities = [...prev];
          newAvailabilities[existingDateIndex] = {
            date: selectedDate,
            slots: [...prev[existingDateIndex].slots, `${time.startTime}-${time.endTime}`]
          };
          return newAvailabilities;
        }

        return [...prev, {
          date: selectedDate,
          slots: [`${time.startTime}-${time.endTime}`]
        }];
      });

      setSuccessMessage('Créneau ajouté avec succès');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add time slot');
    }
  };

  const handleSubmit = async () => {
    if (!user?.uid || !selectedExperience || availabilities.length === 0) {
      setError('Veuillez sélectionner une expérience et ajouter au moins un créneau');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const availabilityData = availabilities.flatMap(({ date, slots }) =>
        slots.map(slot => {
          const [startTime, endTime] = slot.split('-');
          return {
            userId: user.uid,
            experienceId: selectedExperience,
            date,
            startTime,
            endTime
          };
        })
      );

      await Promise.all(
        availabilityData.map(data => availabilityService.createAvailability(data))
      );

      setSuccessMessage('Vos disponibilités ont été enregistrées avec succès');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      setSelectedDate(null);
      setAvailabilities([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save availabilities');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionnez une expérience
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            >
              <option value="">Choisir une expérience</option>
              {experiences.map((experience) => (
                <option key={experience.id} value={experience.id}>
                  {experience.title}
                </option>
              ))}
            </select>
          </div>

          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            availableTimeSlots={availabilities}
          />
        </div>

        <div className="space-y-6">
          {error && <ErrorMessage message={error} />}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-medium mb-4">
              {selectedDate 
                ? `Créneaux pour le ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`
                : 'Sélectionnez une date'}
            </h3>

            {selectedDate && selectedExperience && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                onTimeSelect={handleTimeSlotSelect}
              />
            )}

            {selectedDate && !selectedExperience && (
              <p className="text-sm text-gray-500">
                Veuillez d'abord sélectionner une expérience
              </p>
            )}
          </div>

          {availabilities.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="text-lg font-medium mb-4">Créneaux sélectionnés</h3>
              <div className="space-y-2">
                {availabilities.map(({ date, slots }) => (
                  <div key={date.toISOString()} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">
                      {format(date, 'EEEE d MMMM', { locale: fr })}
                    </p>
                    <div className="mt-2 space-y-1">
                      {slots.map((slot, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          {slot.replace('-', ' à ')}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-4 w-full px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 disabled:bg-gray-400 transition-colors"
              >
                {isSubmitting ? 'Enregistrement...' : 'Valider mes disponibilités'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};