import { CreateAvailabilityData } from '../availability/types';
import { ExperienceAvailability } from './types';

export function mapAvailabilityData(
  experienceId: string,
  userId: string,
  availabilities: ExperienceAvailability[]
): CreateAvailabilityData[] {
  return availabilities.map(availability => ({
    userId,
    experienceId,
    date: availability.date,
    startTime: availability.startTime,
    endTime: availability.endTime
  }));
}