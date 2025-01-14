export function validateTimeRange(startTime: string, endTime: string): void {
  // Validate time format
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    throw new Error('Invalid time format. Must be HH:mm');
  }

  // Convert to minutes for comparison
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (startMinutes >= endMinutes) {
    throw new Error('End time must be after start time');
  }

  if (endMinutes - startMinutes < 30) {
    throw new Error('Time slot must be at least 30 minutes');
  }

  if (endMinutes - startMinutes > 480) { // 8 hours
    throw new Error('Time slot cannot exceed 8 hours');
  }
}