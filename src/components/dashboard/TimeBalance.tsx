import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/user';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';

export const TimeBalance: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBalance = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        setError(null);
        const profile = await userService.getUserProfile(user.uid);
        setBalance(profile?.timeBalance ?? 0);
      } catch (err) {
        console.error('Error loading time balance:', err);
        setError('Unable to load time balance');
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, [user?.uid]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (balance === null) return null;

  return (
    <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-medium">Votre solde de temps</h3>
        <Clock className="w-6 h-6 opacity-80" />
      </div>
      <div className="mt-4">
        <p className="text-6xl font-bold">{balance}h</p>
        <p className="text-lg opacity-80 mt-2">disponibles</p>
      </div>
    </div>
  );
};