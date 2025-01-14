import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface TimeSlotListProps {
  slots: TimeSlot[];
  onRemove: (index: number) => void;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({ slots, onRemove }) => {
  return (
    <div className="space-y-2">
      {slots.map((slot, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <span className="text-sm">
            {format(new Date(slot.day), 'EEEE d MMMM', { locale: fr })} - {slot.startTime} à {slot.endTime}
          </span>
          <button
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
};