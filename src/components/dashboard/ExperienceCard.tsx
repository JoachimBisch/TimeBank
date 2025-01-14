import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { TimeExperience } from '../../types';

interface ExperienceCardProps {
  experience: TimeExperience;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{experience.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{experience.description}</p>
      
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {experience.duration}h
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {experience.location}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {experience.category}
        </span>
        <button className="text-sm font-medium text-black hover:text-gray-700">
          Voir les détails
        </button>
      </div>
    </div>
  );
};