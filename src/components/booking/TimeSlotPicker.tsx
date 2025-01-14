import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeSlot } from '../../types/booking';

interface TimeSlotPickerProps {
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  timeSlots,
  selectedSlot,
  onSelectSlot
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Choisir un créneau</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {timeSlots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSelectSlot(slot)}
            disabled={!slot.available}
            className={`p-4 rounded-lg border text-left transition-colors ${
              selectedSlot?.id === slot.id
                ? 'border-black bg-black text-white'
                : slot.available
                ? 'border-gray-200 hover:border-black'
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          >
            <div className="font-medium">
              {format(slot.startTime, 'EEEE d MMMM', { locale: fr })}
            </div>
            <div className="text-sm">
              {format(slot.startTime, 'HH:mm')} - {format(slot.endTime, 'HH:mm')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};