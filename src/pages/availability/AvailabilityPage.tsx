import React from 'react';
import { AvailabilityCalendar } from '../../components/availability/AvailabilityCalendar';
import { AvailabilityList } from '../../components/availability/AvailabilityList';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const AvailabilityPage: React.FC = () => {
  const { loading } = useRequireAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes disponibilités</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AvailabilityCalendar />
          <AvailabilityList />
        </div>
      </div>
    </div>
  );
};