import { CreateExperienceInput } from './types';

export class ExperienceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExperienceValidationError';
  }
}

export function validateExperienceInput(data: CreateExperienceInput): void {
  if (!data.title?.trim()) {
    throw new ExperienceValidationError('Title is required');
  }

  if (!data.description?.trim()) {
    throw new ExperienceValidationError('Description is required');
  }

  if (data.duration <= 0 || data.duration > 8) {
    throw new ExperienceValidationError('Duration must be between 0 and 8 hours');
  }

  if (!data.category?.trim()) {
    throw new ExperienceValidationError('Category is required');
  }

  if (data.minParticipants < 1) {
    throw new ExperienceValidationError('Minimum participants must be at least 1');
  }

  if (data.maxParticipants < data.minParticipants) {
    throw new ExperienceValidationError('Maximum participants must be greater than or equal to minimum participants');
  }

  if (!data.location?.trim()) {
    throw new ExperienceValidationError('Location is required');
  }

  try {
    new URL(data.imageUrl);
  } catch {
    throw new ExperienceValidationError('Valid image URL is required');
  }
}