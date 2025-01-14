import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Availability } from '../../services/availability/types';
import { TimeSlotList } from './TimeSlotList';

interface BookingCalendarProps {
  availabilities: Availability[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onTimeSlotSelect: (availability: Availability) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  availabilities,
  selectedDate,
  onDateSelect,
  onTimeSlotSelect
}) => {
  // Group availabilities by date
  const availabilitiesByDate = availabilities.reduce((acc, availability) => {
    const dateStr = format(availability.date, 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(availability);
    return acc;
  }, {} as Record<string, Availability[]>);

  const dates = Object.keys(availabilitiesByDate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">Dates disponibles</h3>
          <div className="space-y-2">
            {dates.map(dateStr => {
              const date = new Date(dateStr);
              const isSelected = selectedDate && 
                format(selectedDate, 'yyyy-MM-dd') === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => onDateSelect(date)}
                  className={`w-full p-4 text-left rounded-lg transition-colors ${
                    isSelected 
                      ? 'bg-black text-white' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {format(date, 'EEEE d MMMM', { locale: fr })}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots for selected date */}
        {selectedDate && (
          <div>
            <h3 className="text-lg font-medium mb-4">Créneaux horaires</h3>
            <TimeSlotList
              availabilities={availabilitiesByDate[format(selectedDate, 'yyyy-MM-dd')] || []}
              onSelect={onTimeSlotSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};