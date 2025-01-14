export interface Availability {
  id: string;
  userId: string;
  experienceId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'cancelled';
  createdAt: Date;
}

export interface CreateAvailabilityData {
  userId: string;
  experienceId?: string;
  date: Date;
  startTime: string;
  endTime: string;
}