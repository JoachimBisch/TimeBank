import React from 'react';

interface CalendarGridProps {
  days: string[];
  children: React.ReactNode;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ days, children }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {children}
      </div>
    </div>
  );
};