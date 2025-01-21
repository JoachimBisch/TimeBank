import React from 'react';
import { AddAvailabilityForm } from './AddAvailabilityForm';

export const AvailabilityManager: React.FC = () => {
  // Fonction mock pour simuler l'API
  const mockCreateAvailability = async (startTime: string, endTime: string) => {
    console.log(`Simulation : Créneau ajouté de ${startTime} à ${endTime}`);
    return Promise.resolve(); // Simule une promesse résolue
  };

  return (
    <div>
      <h2>Ajouter une disponibilité</h2>
      {/* Passe la fonction mock en prop */}
      <AddAvailabilityForm onSubmit={mockCreateAvailability} />
    </div>
  );
};