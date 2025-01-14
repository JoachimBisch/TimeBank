export interface CreateBookingData {
  experienceId: string;
  guestUserId: string;
  hostUserId: string;
  timeSlot: {
    startTime: Date;
    endTime: Date;
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';