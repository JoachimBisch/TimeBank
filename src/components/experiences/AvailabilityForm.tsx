import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TimeSlot } from '../../services/availability/types';

interface AvailabilityFormProps {
  onSubmit: (slots: TimeSlot[]) => void;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onSubmit }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, {
      date: new Date(),
      startTime: '09:00',
      endTime: '17:00'
    }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string | Date) => {
    const newSlots = [...timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setTimeSlots(newSlots);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (timeSlots.length === 0) {
      setError('Veuillez ajouter au moins un créneau horaire');
      return;
    }

    if (timeSlots.some(slot => !slot.date || !slot.startTime || !slot.endTime)) {
      setError('Veuillez remplir tous les champs pour chaque créneau');
      return;
    }

    setError(null);
    onSubmit(timeSlots);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex items-center space-x-4">
            <input
              type="date"
              value={format(slot.date, 'yyyy-MM-dd')}
              onChange={(e) => updateTimeSlot(index, 'date', new Date(e.target.value))}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
            <input
              type="time"
              value={slot.startTime}
              onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
            <span>à</span>
            <input
              type="time"
              value={slot.endTime}
              onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
            <button
              type="button"
              onClick={() => removeTimeSlot(index)}
              className="text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={addTimeSlot}
          className="text-blue-600 hover:text-blue-800"
        >
          + Ajouter un créneau
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900"
        >
          Continuer
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </form>
  );
};