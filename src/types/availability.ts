import { TimeSlot } from './booking';

export interface UserAvailability {
  userId: string;
  weeklySchedule: WeeklySchedule;
  exceptions: DateException[];
  lastUpdated: Date;
}

export interface WeeklySchedule {
  [key: string]: DaySchedule; // 'monday', 'tuesday', etc.
}

export interface DaySchedule {
  available: boolean;
  slots: TimeRange[];
}

export interface TimeRange {
  start: string; // Format "HH:mm"
  end: string; // Format "HH:mm"
}

export interface DateException {
  date: string; // Format "YYYY-MM-DD"
  type: 'unavailable' | 'available';
  slots?: TimeRange[];
}

export interface AvailabilitySlot {
  date: Date;
  timeSlots: TimeSlot[];
  hostId: string;
  experienceId: string;
}