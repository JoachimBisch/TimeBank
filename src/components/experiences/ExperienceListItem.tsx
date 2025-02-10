import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { TimeExperience } from '../../types';

interface ExperienceListItemProps {
  experience: TimeExperience;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export const ExperienceListItem: React.FC<ExperienceListItemProps> = ({
  experience,
  onEdit,
  onDelete,
  isDeleting
}) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      await onDelete(experience.id);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{experience.title}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={onEdit}
            className="text-gray-600 hover:text-black"
          >
            {/* <Pencil className="w-4 h-4" /> */}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`text-gray-600 hover:text-red-600 transition-colors ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {/* <Trash2 className="w-4 h-4" /> */}
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-1">{experience.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm font-medium">{experience.duration}h</span>
        <span className="text-sm text-gray-500">{experience.category}</span>
      </div>
    </div>
  );
};