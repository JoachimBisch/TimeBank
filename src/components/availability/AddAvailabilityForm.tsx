import React, { useState } from 'react';

interface AddAvailabilityFormProps {
  onSubmit: (startTime: string, endTime: string) => Promise<void>;
}

export const AddAvailabilityForm: React.FC<AddAvailabilityFormProps> = ({ onSubmit }) => {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (startTime >= endTime) {
      alert('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(startTime, endTime);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Heure de début
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Heure de fin
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 disabled:bg-gray-400"
      >
        {submitting ? 'Ajout...' : 'Ajouter ce créneau'}
      </button>
    </form>
  );
};