import { CreateAvailabilityData } from '../types';
import { validateDate } from '../utils/dateUtils';
import { validateTimeRange } from '../utils/timeUtils';

export class AvailabilityValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AvailabilityValidationError';
  }
}

export function validateAvailability(data: CreateAvailabilityData): void {
  try {
    // Validate required fields
    if (!data.userId) {
      throw new AvailabilityValidationError('User ID is required');
    }

    // Validate date
    validateDate(data.date);

    // Validate time range
    validateTimeRange(data.startTime, data.endTime);

  } catch (error) {
    if (error instanceof Error) {
      throw new AvailabilityValidationError(error.message);
    }
    throw new AvailabilityValidationError('Invalid availability data');
  }
}