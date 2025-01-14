import { useState, useCallback, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addDays,
  subDays
} from 'date-fns';

interface TimeSlot {
  date: Date;
  slots: string[];
}

export const useCalendar = (availableTimeSlots: TimeSlot[] = []) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = useCallback(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const isDateAvailable = useCallback((date: Date) => {
    return availableTimeSlots.some(slot => isSameDay(slot.date, date));
  }, [availableTimeSlots]);

  const getAvailableSlots = useCallback((date: Date) => {
    const slot = availableTimeSlots.find(slot => isSameDay(slot.date, date));
    return slot?.slots || [];
  }, [availableTimeSlots]);

  return {
    currentMonth,
    currentDate,
    setCurrentMonth,
    setCurrentDate,
    getDaysInMonth,
    isDateAvailable,
    getAvailableSlots
  };
};