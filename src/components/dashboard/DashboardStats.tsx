import React from 'react';
import { StatsGrid } from './StatsGrid';

interface DashboardStatsProps {
  stats: {
    exchangesCount: number;
    totalHours: number;
    rating: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return <StatsGrid stats={stats} />;
};