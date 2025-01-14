import { functions } from '../../lib/firebase';
import { httpsCallable } from 'firebase/functions';

class EmailService {
  private readonly sendEmail = httpsCallable(functions, 'sendEmail');

  async sendBookingNotification(
    hostEmail: string,
    experienceTitle: string,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<void> {
    try {
      await this.sendEmail({
        type: 'newBooking',
        to: hostEmail,
        data: {
          experienceTitle,
          date,
          startTime,
          endTime
        }
      });
    } catch (error) {
      console.error('Failed to send booking notification:', error);
    }
  }

  async sendBookingConfirmation(
    guestEmail: string,
    experienceTitle: string,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<void> {
    try {
      await this.sendEmail({
        type: 'bookingConfirmed',
        to: guestEmail,
        data: {
          experienceTitle,
          date,
          startTime,
          endTime
        }
      });
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
    }
  }

  async sendSessionReminder(
    email: string,
    experienceTitle: string,
    startTime: string,
    endTime: string,
    isHost: boolean
  ): Promise<void> {
    try {
      await this.sendEmail({
        type: 'sessionReminder',
        to: email,
        data: {
          experienceTitle,
          startTime,
          endTime,
          isHost
        }
      });
    } catch (error) {
      console.error('Failed to send session reminder:', error);
    }
  }
}

export const emailService = new EmailService();