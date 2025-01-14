import { parse } from 'date-fns';
import { TimeRange } from '../../../types/availability';
import { TimeSlot } from '../../../types/booking';

export const parseTimeSlots = (date: Date, slots: TimeRange[]): TimeSlot[] => {
  return slots.map(slot => ({
    startTime: parse(slot.start, 'HH:mm', date),
    endTime: parse(slot.end, 'HH:mm', date)
  }));
};