import { z } from 'zod';

export const availabilitySchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  date: z.date(),
  startTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  endTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  experienceId: z.string().optional()
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;