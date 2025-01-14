import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteExperienceButtonProps {
  experienceId: string;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export const DeleteExperienceButton: React.FC<DeleteExperienceButtonProps> = ({
  experienceId,
  onDelete,
  isDeleting
}) => {
  const handleClick = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette expérience ?')) {
      await onDelete(experienceId);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isDeleting}
      className={`text-gray-600 hover:text-red-600 ${
        isDeleting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};