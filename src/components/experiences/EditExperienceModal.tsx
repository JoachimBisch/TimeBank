import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TimeExperience } from '../../types';
import { experienceService } from '../../services/experienceService';

const experienceSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  duration: z.number().min(0.5, 'La durée minimum est de 30 minutes').max(8, 'La durée maximum est de 8 heures'),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  minParticipants: z.number().min(1, 'Minimum 1 participant'),
  maxParticipants: z.number().min(1, 'Minimum 1 participant'),
  location: z.string().min(1, 'Veuillez indiquer un lieu'),
  imageUrl: z.string().url('Veuillez fournir une URL d\'image valide')
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

interface EditExperienceModalProps {
  experience: TimeExperience;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const categories = [
  'Sport',
  'Musique',
  'Cuisine',
  'Art & Créativité',
  'Technologie',
  'Langues',
  'Bien-être',
  'Business',
  'Éducation',
  'Voyage',
  'Autre'
];

export const EditExperienceModal: React.FC<EditExperienceModalProps> = ({
  experience,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: experience.title,
      description: experience.description,
      duration: experience.duration,
      category: experience.category,
      minParticipants: experience.minParticipants,
      maxParticipants: experience.maxParticipants,
      location: experience.location,
      imageUrl: experience.imageUrl
    }
  });

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    try {
      await experienceService.updateExperience(experience.id, data);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'expérience:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Modifier l'expérience
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Mêmes champs que CreateExperienceModal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    {...register('title')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Durée (heures)</label>
                    <input
                      type="number"
                      step="0.5"
                      {...register('duration', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <select
                      {...register('category')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min. participants</label>
                    <input
                      type="number"
                      {...register('minParticipants', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                    {errors.minParticipants && (
                      <p className="mt-1 text-sm text-red-600">{errors.minParticipants.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max. participants</label>
                    <input
                      type="number"
                      {...register('maxParticipants', { valueAsNumber: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                    />
                    {errors.maxParticipants && (
                      <p className="mt-1 text-sm text-red-600">{errors.maxParticipants.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Lieu</label>
                  <input
                    type="text"
                    {...register('location')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">URL de l'image</label>
                  <input
                    type="url"
                    {...register('imageUrl')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                  />
                  {errors.imageUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
                  )}
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};