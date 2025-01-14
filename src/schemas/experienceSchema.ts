import { z } from 'zod';

export const experienceSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  duration: z.number().min(0.5, 'La durée minimum est de 30 minutes').max(8, 'La durée maximum est de 8 heures'),
  category: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  minParticipants: z.number().min(1, 'Minimum 1 participant'),
  maxParticipants: z.number().min(1, 'Minimum 1 participant'),
  location: z.string().min(1, 'Veuillez indiquer un lieu'),
  imageUrl: z.string().url('Veuillez fournir une URL d\'image valide')
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;