import React, { useState } from 'react';
import { TimeExperience } from '../../types';
import { ExperienceCard } from './ExperienceCard';
import { BookingModal } from '../booking/BookingModal';

interface ExperienceListProps {
  experiences: TimeExperience[];
}

export const ExperienceList: React.FC<ExperienceListProps> = ({ experiences }) => {
  const [selectedExperience, setSelectedExperience] = useState<TimeExperience | null>(null);

  if (experiences.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune expérience trouvée
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map(experience => (
          <ExperienceCard 
            key={experience.id}
            experience={experience}
            onBook={() => setSelectedExperience(experience)}
          />
        ))}
      </div>

      {selectedExperience && (
        <BookingModal
          experience={selectedExperience}
          isOpen={!!selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </>
  );
};