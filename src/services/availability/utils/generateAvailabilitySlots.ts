import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { UserAvailability, AvailabilitySlot } from '../../../types/availability';
import { parseTimeSlots } from './parseTimeSlots';

export const generateAvailabilitySlots = (
  userId: string,
  availability: Omit<UserAvailability, 'userId' | 'lastUpdated'>
): AvailabilitySlot[] => {
  const startDate = new Date();
  const endDate = addDays(startDate, 30);
  const slots: AvailabilitySlot[] = [];

  let currentDate = startDate;
  while (currentDate <= endDate) {
    const dayOfWeek = format(currentDate, 'EEEE', { locale: fr }).toLowerCase();
    const daySchedule = availability.weeklySchedule[dayOfWeek];

    if (daySchedule?.available) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const exception = availability.exceptions.find(e => e.date === dateStr);

      if (!exception || (exception.type === 'available' && exception.slots)) {
        const timeSlots = parseTimeSlots(
          currentDate,
          exception?.type === 'available' ? exception.slots : daySchedule.slots
        );

        slots.push({
          date: currentDate,
          timeSlots,
          hostId: userId,
          experienceId: ''
        });
      }
    }

    currentDate = addDays(currentDate, 1);
  }

  return slots;
};