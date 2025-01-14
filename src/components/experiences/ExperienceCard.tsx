import React, { useState } from 'react';
import { Clock, Users, MapPin } from 'lucide-react';
import { TimeExperience } from '../../types';
import { BookingModal } from '../booking/BookingModal';

interface ExperienceCardProps {
  experience: TimeExperience;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBookClick = () => {
    setShowBookingModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Image de l'expérience */}
        <div className="relative h-48 w-full">
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800">
              {experience.category}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{experience.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{experience.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {experience.duration}h
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {experience.minParticipants}-{experience.maxParticipants} pers.
            </div>
            {experience.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {experience.location}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleBookClick}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-900 transition-colors cursor-pointer"
          >
            Réserver
          </button>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          experience={experience}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  );
};