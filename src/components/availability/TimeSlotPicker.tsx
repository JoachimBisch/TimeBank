import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  selectedDate: Date | null;
  onTimeSelect: (time: { startTime: string; endTime: string }) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedDate,
  onTimeSelect
}) => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState<string | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    onTimeSelect({ startTime, endTime });
  };

  if (!selectedDate) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center mb-4">
        <Clock className="w-5 h-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-medium">Choose a time slot</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start time
            </label>
            <select
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setError(null);
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End time
            </label>
            <select
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setError(null);
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            >
              {hours.map((hour) => (
                <option 
                  key={hour} 
                  value={hour}
                  disabled={hour <= startTime}
                >
                  {hour}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900"
        >
          Add time slot
        </button>
      </form>
    </div>
  );
};