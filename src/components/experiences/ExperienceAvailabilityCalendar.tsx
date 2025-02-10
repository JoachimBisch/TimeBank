import React, { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '../calendar/Calendar';
import { availabilityService } from '../../services/availability/availabilityService';
import { Availability } from '../../services/availability/types';
// import { TimeExperience } from '../../types';
import { Clock } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';

interface ExperienceAvailabilityCalendarProps {
  experience: TimeExperience;
  isOwner: boolean;
  onTimeSlotSelect?: (slot: { date: Date; startTime: string; endTime: string }) => void;
}

export const ExperienceAvailabilityCalendar: React.FC<ExperienceAvailabilityCalendarProps> = ({
  experience,
  isOwner,
  onTimeSlotSelect
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (experience.id) {
      loadAvailabilities();
    }
  }, [experience.id]);

  const loadAvailabilities = async () => {
    try {
      setLoading(true);
      setError(null);
      const slots = await availabilityService.getExperienceAvailabilities(experience.id);
      setAvailabilities(slots);
      console.log(setLoading)
    } catch (err) {
      setError('Unable to load available time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot: Availability) => {
    if (!onTimeSlotSelect) return;
    onTimeSlotSelect({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const availableTimeSlots = availabilities.map(a => ({
    date: a.date,
    slots: [`${a.startTime}-${a.endTime}`]
  }));

  const selectedDateSlots = availabilities.filter(a => 
    selectedDate && isSameDay(a.date, selectedDate)
  );

  if (availabilities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available time slots for this experience
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Calendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        availableTimeSlots={availableTimeSlots}
      />

      {selectedDate && selectedDateSlots.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">
            Available slots for {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
          <div className="space-y-2">
            {selectedDateSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                </div>
                <span className="text-sm text-gray-500">Select</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedDateSlots.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No available slots for this date
        </div>
      )}
    </div>
  );
};