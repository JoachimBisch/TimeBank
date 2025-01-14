import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <button
        onClick={onPreviousMonth}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <h2 className="text-lg font-semibold">
        {format(currentMonth, 'MMMM yyyy', { locale: fr })}
      </h2>
      
      <button
        onClick={onNextMonth}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};