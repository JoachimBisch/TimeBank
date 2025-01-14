import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { availabilityService } from '../../services/availabilityService';

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export const AvailabilityCalendar: React.FC = () => {
  const { user } = useAuth();
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAvailability = async () => {
      if (!user) return;
      try {
        const slots = await availabilityService.getUserAvailability(user.uid);
        setSelectedSlots(slots);
      } catch (error) {
        console.error('Erreur lors du chargement des disponibilités:', error);
        setError('Impossible de charger vos disponibilités');
      }
    };

    loadAvailability();
  }, [user]);

  // Générer les 7 prochains jours
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    };
  });

  // Générer les heures de 6h à 23h
  const hours = Array.from({ length: 18 }, (_, i) => {
    const hour = i + 6;
    return {
      value: hour.toString().padStart(2, '0'),
      label: `${hour}h`
    };
  });

  const addTimeSlot = () => {
    if (!selectedDay || !startHour || !endHour) return;

    const newSlot = {
      day: selectedDay,
      startTime: `${startHour}:00`,
      endTime: `${endHour}:00`
    };

    setSelectedSlots(prev => [...prev, newSlot]);
    setStartHour('');
    setEndHour('');
  };

  const removeTimeSlot = (index: number) => {
    setSelectedSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setError(null);
    
    try {
      await availabilityService.saveUserAvailability(user.uid, selectedSlots);
      alert('Vos disponibilités ont été enregistrées avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Mes disponibilités</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
            <select 
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            >
              <option value="">Sélectionner un jour</option>
              {days.map(day => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
            <select
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            >
              <option value="">Sélectionner une heure</option>
              {hours.map(hour => (
                <option key={hour.value} value={hour.value}>{hour.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
            <select
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            >
              <option value="">Sélectionner une heure</option>
              {hours.map(hour => (
                <option key={hour.value} value={hour.value}>{hour.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={addTimeSlot}
            className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900"
          >
            Ajouter un créneau
          </button>
        </div>

        <div className="space-y-2">
          {selectedSlots.map((slot, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm">
                {new Date(slot.day).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} - {slot.startTime} à {slot.endTime}
              </span>
              <button
                onClick={() => removeTimeSlot(index)}
                className="text-red-600 hover:text-red-800"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900 disabled:bg-gray-400"
          >
            <Clock className="w-4 h-4 mr-2" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer mes disponibilités'}
          </button>
        </div>
      </div>
    </div>
  );
};