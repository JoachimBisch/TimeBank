import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { availabilityService } from '../../services/availability/availabilityService';
import { Availability } from '../../services/availability/types';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';

export const AvailabilityList: React.FC = () => {
  const { user } = useAuth();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAvailabilities = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError(null);
      const data = await availabilityService.getUserAvailabilities(user.uid);
      setAvailabilities(data.sort((a, b) => a.date.getTime() - b.date.getTime()));
    } catch (err) {
      console.error('Error loading availabilities:', err);
      setError('Unable to load your availabilities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailabilities();
    
    // Listen for updates from calendar
    window.addEventListener('availability-updated', loadAvailabilities);
    return () => window.removeEventListener('availability-updated', loadAvailabilities);
  }, [user?.uid]);

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError(null);
      await availabilityService.deleteAvailability(id);
      setAvailabilities(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting availability:', err);
      setError('Unable to delete the availability. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Créneaux disponibles</h2>

      <div className="space-y-4">
        {availabilities.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Aucun créneau disponible
          </p>
        ) : (
          availabilities.map(availability => (
            <div 
              key={availability.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">
                    {format(availability.date, 'EEEE d MMMM', { locale: fr })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {availability.startTime} - {availability.endTime}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(availability.id)}
                disabled={deletingId === availability.id}
                className={`text-gray-400 hover:text-red-600 transition-colors ${
                  deletingId === availability.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};