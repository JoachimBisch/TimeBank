import React from 'react';
import { Clock } from 'lucide-react';

interface TimeCounterProps {
  hours: number;
}

export const TimeCounter: React.FC<TimeCounterProps> = ({ hours }) => {
  return (
    <div className="flex items-center space-x-2 text-2xl font-bold">
      <Clock className="w-6 h-6 text-black/80" />
      <span>{hours}h</span>
    </div>
  );
};