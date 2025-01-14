import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

const FROM_EMAIL = 'TimeBank <noreply@timebank.com>';

export const sendEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to send emails'
    );
  }

  const { type, to, data: emailData } = data;

  let subject = '';
  let html = '';

  switch (type) {
    case 'newBooking':
      subject = `Nouvelle réservation pour ${emailData.experienceTitle}`;
      html = `
        <h2>Nouvelle réservation !</h2>
        <p>Une personne a réservé votre expérience "${emailData.experienceTitle}"</p>
        <p><strong>Date :</strong> ${format(new Date(emailData.date), 'EEEE d MMMM yyyy', { locale: fr })}</p>
        <p><strong>Horaire :</strong> ${emailData.startTime} - ${emailData.endTime}</p>
        <p>Connectez-vous à votre compte TimeBank pour confirmer la réservation.</p>
      `;
      break;

    case 'bookingConfirmed':
      subject = `Réservation confirmée : ${emailData.experienceTitle}`;
      html = `
        <h2>Votre réservation est confirmée !</h2>
        <p>Votre réservation pour "${emailData.experienceTitle}" a été confirmée.</p>
        <p><strong>Date :</strong> ${format(new Date(emailData.date), 'EEEE d MMMM yyyy', { locale: fr })}</p>
        <p><strong>Horaire :</strong> ${emailData.startTime} - ${emailData.endTime}</p>
      `;
      break;

    case 'sessionReminder':
      subject = `Rappel : Session ${emailData.experienceTitle} aujourd'hui`;
      html = `
        <h2>Rappel : Vous avez une session aujourd'hui !</h2>
        <p>${emailData.isHost ? 'Vous animez' : 'Vous participez à'} "${emailData.experienceTitle}"</p>
        <p><strong>Horaire :</strong> ${emailData.startTime} - ${emailData.endTime}</p>
      `;
      break;

    default:
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid email type'
      );
  }

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject,
      html
    });
  } catch (error) {
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send email'
    );
  }
});

// Cloud Function to send session reminders
export const sendSessionReminders = functions.pubsub
  .schedule('0 0 * * *') // Run at midnight every day
  .timeZone('Europe/Paris')
  .onRun(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      const bookingsSnapshot = await admin.firestore()
        .collection('bookings')
        .where('status', '==', 'confirmed')
        .where('timeSlot.startTime', '>=', today)
        .where('timeSlot.startTime', '<', tomorrow)
        .get();

      const sendReminders = bookingsSnapshot.docs.map(async (doc) => {
        const booking = doc.data();
        
        // Get user emails
        const [host, guest] = await Promise.all([
          admin.firestore().collection('users').doc(booking.hostUserId).get(),
          admin.firestore().collection('users').doc(booking.guestUserId).get()
        ]);

        // Send reminders to both host and guest
        await Promise.all([
          transporter.sendMail({
            from: FROM_EMAIL,
            to: host.data()?.email,
            subject: `Rappel : Session ${booking.experienceTitle} aujourd'hui`,
            html: `
              <h2>Rappel : Vous animez une session aujourd'hui !</h2>
              <p>Vous animez "${booking.experienceTitle}"</p>
              <p><strong>Horaire :</strong> ${format(booking.timeSlot.startTime.toDate(), 'HH:mm')} - ${format(booking.timeSlot.endTime.toDate(), 'HH:mm')}</p>
            `
          }),
          transporter.sendMail({
            from: FROM_EMAIL,
            to: guest.data()?.email,
            subject: `Rappel : Session ${booking.experienceTitle} aujourd'hui`,
            html: `
              <h2>Rappel : Vous participez à une session aujourd'hui !</h2>
              <p>Vous participez à "${booking.experienceTitle}"</p>
              <p><strong>Horaire :</strong> ${format(booking.timeSlot.startTime.toDate(), 'HH:mm')} - ${format(booking.timeSlot.endTime.toDate(), 'HH:mm')}</p>
            `
          })
        ]);
      });

      await Promise.all(sendReminders);
    } catch (error) {
      console.error('Error sending reminders:', error);
    }
  });