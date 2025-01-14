import React from 'react';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { Clock } from 'lucide-react';

interface CalendarDayProps {
  day: Date;
  currentMonth: Date;
  selectedDate?: Date;
  isAvailable?: boolean;
  onSelect?: (date: Date) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  currentMonth,
  selectedDate,
  isAvailable,
  onSelect
}) => {
  const isSelected = selectedDate && isSameDay(day, selectedDate);
  const isCurrentMonth = isSameMonth(day, currentMonth);
  
  return (
    <button
      onClick={() => onSelect?.(day)}
      disabled={!isCurrentMonth || !isAvailable}
      className={`
        relative w-full pt-[100%] rounded-lg transition-colors
        ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
        ${isSelected ? 'ring-2 ring-black' : ''}
        ${!isCurrentMonth ? 'cursor-not-allowed' : ''}
        ${!isAvailable && isCurrentMonth ? 'cursor-not-allowed bg-gray-100' : ''}
      `}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`
          text-sm font-medium
          ${!isCurrentMonth ? 'text-gray-300' : ''}
          ${isSelected ? 'text-black' : ''}
          ${!isAvailable && isCurrentMonth ? 'text-gray-400' : ''}
        `}>
          {format(day, 'd')}
        </span>
        
        {isAvailable && isCurrentMonth && (
          <Clock className="w-4 h-4 text-green-500 mt-1" />
        )}
      </div>
    </button>
  );
};