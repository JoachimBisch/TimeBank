import React from 'react';
import { TimeBalance } from '../../components/dashboard/TimeBalance';
import { StatsGrid } from '../../components/dashboard/StatsGrid';
import { MyBookings } from '../../components/dashboard/bookings/MyBookings';
import { MyExperiences } from '../../components/dashboard/MyExperiences';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const DashboardPage: React.FC = () => {
  const { loading } = useRequireAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Balance */}
        <div className="mb-8">
          <TimeBalance />
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <StatsGrid />
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Mes réservations à venir</h2>
          <MyBookings />
        </div>

        {/* My Experiences */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Mes expériences proposées</h2>
          <MyExperiences />
        </div>
      </div>
    </div>
  );
};