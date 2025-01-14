import React from 'react';
import { Clock } from 'lucide-react';
import { Availability } from '../../services/availability/types';

interface TimeSlotListProps {
  availabilities: Availability[];
  onSelect: (availability: Availability) => void;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({ 
  availabilities,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      {availabilities.map((availability) => (
        <button
          key={availability.id}
          onClick={() => onSelect(availability)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>
              {availability.startTime} - {availability.endTime}
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