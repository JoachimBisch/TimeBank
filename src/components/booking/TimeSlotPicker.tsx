import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeSlot } from '../../types/booking';

interface TimeSlotListProps {
  availabilities: TimeSlot[];  // Utiliser le type TimeSlot tel quel
  onSelect: (availability: TimeSlot) => void;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({ 
  availabilities,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      {availabilities.map((availability, index) => (
        <button
          key={index}  // Utiliser l'index comme identifiant unique si tu n'as pas d'ID, ce qui n'est pas l'ideal, meixu vaudrait un ID pour chaque timeslot
          onClick={() => onSelect(availability)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <span>
              {format(availability.startTime, 'HH:mm')} - {format(availability.endTime, 'HH:mm')}
            </span>
          </div>
        </button>
      ))}

      {availabilities.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          Aucun créneau disponible pour cette date
        </p>
      )}
    </div>
  );
};