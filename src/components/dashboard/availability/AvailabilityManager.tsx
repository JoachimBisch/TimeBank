import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Clock } from 'lucide-react';

export const AvailabilityManager: React.FC = () => {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<Array<{start: string, end: string}>>([]);

  const days = [
    'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'
  ];

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: '09:00', end: '17:00' }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Mes disponibilités</h2>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jour de la semaine
          </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
          >
            <option value="">Sélectionner un jour</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        {selectedDay && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Créneaux pour {selectedDay}</h3>
              <button
                onClick={addTimeSlot}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Ajouter un créneau
              </button>
            </div>

            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="time"
                  value={slot.start}
                  onChange={(e) => {
                    const newSlots = [...timeSlots];
                    newSlots[index] = { ...slot, start: e.target.value };
                    setTimeSlots(newSlots);
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
                <span>à</span>
                <input
                  type="time"
                  value={slot.end}
                  onChange={(e) => {
                    const newSlots = [...timeSlots];
                    newSlots[index] = { ...slot, end: e.target.value };
                    setTimeSlots(newSlots);
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                />
                <button
                  onClick={() => removeTimeSlot(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};