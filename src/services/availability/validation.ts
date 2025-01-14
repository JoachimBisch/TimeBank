import { CreateAvailabilityData } from './types';

export class AvailabilityValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AvailabilityValidationError';
  }
}

export function validateAvailabilityData(data: CreateAvailabilityData): void {
  // Check required fields
  if (!data.userId) {
    throw new AvailabilityValidationError('User ID is required');
  }

  if (!data.date || !(data.date instanceof Date) || isNaN(data.date.getTime())) {
    throw new AvailabilityValidationError('Valid date is required');
  }

  // Validate date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(data.date);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    throw new AvailabilityValidationError('Cannot create availability for past dates');
  }

  // Validate time format and values
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!timeRegex.test(data.startTime)) {
    throw new AvailabilityValidationError('Start time must be in HH:mm format');
  }

  if (!timeRegex.test(data.endTime)) {
    throw new AvailabilityValidationError('End time must be in HH:mm format');
  }

  // Validate time logic
  const [startHour, startMinute] = data.startTime.split(':').map(Number);
  const [endHour, endMinute] = data.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes >= endMinutes) {
    throw new AvailabilityValidationError('End time must be after start time');
  }

  if (endMinutes - startMinutes < 30) {
    throw new AvailabilityValidationError('Time slot must be at least 30 minutes');
  }

  if (endMinutes - startMinutes > 480) { // 8 hours
    throw new AvailabilityValidationError('Time slot cannot exceed 8 hours');
  }
}