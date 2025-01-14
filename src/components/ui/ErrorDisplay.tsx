import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="bg-red-50 text-red-600 p-4 rounded-lg">
      {message}
    </div>
  </div>
);