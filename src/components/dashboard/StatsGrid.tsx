import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/user';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';

interface Stats {
  exchangesCount: number;
  totalHours: number;
  rating: number;
}

export const StatsGrid: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        setError(null);
        const profile = await userService.getUserProfile(user.uid);
        if (profile) {
          setStats({
            exchangesCount: profile.exchangesCount ?? 0,
            totalHours: profile.exchangedHours ?? 0,
            rating: profile.rating ?? 5.0
          });
        }
      } catch (err) {
        console.error('Error loading stats:', err);
        setError('Unable to load statistics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.uid]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Échanges</h3>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-2xl font-bold">{stats.exchangesCount}</p>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Heures échangées</h3>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-2xl font-bold">{stats.totalHours}h</p>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">Note moyenne</h3>
          <Star className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-2xl font-bold">{stats.rating.toFixed(1)}/5</p>
      </div>
    </div>
  );
};