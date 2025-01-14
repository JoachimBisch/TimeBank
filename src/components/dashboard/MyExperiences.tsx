import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { experienceService } from '../../services/experiences/experienceService';
import { TimeExperience } from '../../types';
import { Plus } from 'lucide-react';
import { CreateExperienceModal } from '../experiences/CreateExperienceModal';
import { EditExperienceModal } from '../experiences/EditExperienceModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ExperienceListItem } from '../experiences/ExperienceListItem';

export const MyExperiences: React.FC = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<TimeExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<TimeExperience | null>(null);

  const loadExperiences = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      setError(null);
      const userExperiences = await experienceService.getUserExperiences(user.uid);
      setExperiences(userExperiences);
    } catch (err) {
      setError('Unable to load your experiences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      loadExperiences();
    }
  }, [user?.uid]);

  const handleDelete = async (experienceId: string) => {
    try {
      setDeletingId(experienceId);
      setError(null);
      await experienceService.deleteExperience(experienceId);
      setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
    } catch (err) {
      setError('Unable to delete the experience. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-gray-500">You haven't created any experiences yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiences.map((experience) => (
            <ExperienceListItem
              key={experience.id}
              experience={experience}
              onEdit={() => setEditingExperience(experience)}
              onDelete={handleDelete}
              isDeleting={deletingId === experience.id}
            />
          ))}
        </div>
      )}

      <CreateExperienceModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          loadExperiences();
        }}
      />

      {editingExperience && (
        <EditExperienceModal
          experience={editingExperience}
          isOpen={true}
          onClose={() => setEditingExperience(null)}
          onUpdate={() => {
            setEditingExperience(null);
            loadExperiences();
          }}
        />
      )}
    </div>
  );
};