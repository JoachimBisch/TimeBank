import React from 'react';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface TimeSlotFormProps {
  selectedDay: string;
  startHour: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  onDayChange: (day: string) => void;
  onStartHourChange: (hour: string) => void;
  onStartMinuteChange: (minute: string) => void;
  onEndHourChange: (hour: string) => void;
  onEndMinuteChange: (minute: string) => void;
  onAdd: () => void;
}

const days = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    value: format(date, 'yyyy-MM-dd'),
    label: format(date, 'EEEE d MMMM', { locale: fr })
  };
});

const hours = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6;
  return {
    value: hour.toString().padStart(2, '0'),
    label: `${hour}h`
  };
});

const minutes = ['00', '15', '30', '45'];

export const TimeSlotForm: React.FC<TimeSlotFormProps> = ({
  selectedDay,
  startHour,
  startMinute,
  endHour,
  endMinute,
  onDayChange,
  onStartHourChange,
  onStartMinuteChange,
  onEndHourChange,
  onEndMinuteChange,
  onAdd
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
        <select 
          value={selectedDay}
          onChange={(e) => onDayChange(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        >
          {days.map(day => (
            <option key={day.value} value={day.value}>{day.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
        <div className="flex space-x-2">
          <select 
            value={startHour}
            onChange={(e) => onStartHourChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            {hours.map(hour => (
              <option key={hour.value} value={hour.value}>{hour.label}</option>
            ))}
          </select>
          <select
            value={startMinute}
            onChange={(e) => onStartMinuteChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            {minutes.map(minute => (
              <option key={minute} value={minute}>{minute}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
        <div className="flex space-x-2">
          <select 
            value={endHour}
            onChange={(e) => onEndHourChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            {hours.map(hour => (
              <option key={hour.value} value={hour.value}>{hour.label}</option>
            ))}
          </select>
          <select
            value={endMinute}
            onChange={(e) => onEndMinuteChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            {minutes.map(minute => (
              <option key={minute} value={minute}>{minute}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onAdd}
        className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900"
      >
        Ajouter
      </button>
    </div>
  );
};