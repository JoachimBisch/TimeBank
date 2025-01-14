import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock } from 'lucide-react';

interface CalendarProps {
  selectedDate?: Date | null;
  onDateSelect?: (date: Date) => void;
  availableTimeSlots?: { date: Date; slots: string[] }[];
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  availableTimeSlots = []
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const isDateAvailable = (date: Date) => {
    return availableTimeSlots.some(slot => 
      isSameDay(slot.date, date)
    );
  };

  const handleDateClick = (date: Date) => {
    if (onDateSelect && isSameMonth(date, currentMonth)) {
      onDateSelect(date);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button
          onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </h2>
        <button
          onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          →
        </button>
      </div>

      <div className="p-4">
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
            const hasSlots = isDateAvailable(day);

            return (
              <div
                key={idx}
                onClick={() => !isPast && isCurrentMonth && handleDateClick(day)}
                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-lg
                  ${isCurrentMonth && !isPast ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'}
                  ${isSelected ? 'ring-2 ring-black' : ''}
                  ${isPast ? 'text-gray-300' : ''}
                  ${!isCurrentMonth ? 'text-gray-300' : ''}
                `}
              >
                <span className={`
                  text-sm font-medium
                  ${isToday(day) ? 'bg-black text-white w-7 h-7 flex items-center justify-center rounded-full' : ''}
                `}>
                  {format(day, 'd')}
                </span>
                {hasSlots && isCurrentMonth && !isPast && (
                  <div className="mt-1">
                    <Clock className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};