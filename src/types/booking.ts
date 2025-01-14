export interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

export interface Booking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  hostUserId: string;
  guestUserId: string;
  timeSlot: TimeSlot;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  hostUser?: {
    firstName: string;
    lastName: string;
  };
  guestUser?: {
    firstName: string;
    lastName: string;
  };
}