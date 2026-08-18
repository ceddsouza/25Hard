import cron from 'node-cron';
import sgMail from '@sendgrid/mail';
import pool from '../db.js';
import { checkAndResetStreaks } from './streakService.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const USERS = [
  { id: 1, name: "Cedric D'Souza", email: 'ced.dsouza@gmail.com' },
  { id: 2, name: 'Nader Merhi', email: 'marcomerhi@gmail.com' },
  { id: 3, name: 'Rahil Hoque', email: 'rahilhoque@gmail.com' },
];


const sendMissedDayAlert = async (user) => {
  try {
    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: '❌ 25Hard - Streak Broken!',
      html: `
        <h2>Oh no, ${user.name}!</h2>
        <p>You missed yesterday's challenge. Your streak has been reset to 0.</p>
        <p>To continue the challenge, you can pay $10 to the pot and resume your journey.</p>
        <p>Let's get back on track today! 💪</p>
      `,
    };

    await sgMail.send(msg);
    console.log(`Missed day alert sent to ${user.email}`);
  } catch (err) {
    console.error(`Failed to send missed day alert to ${user.email}:`, err);
  }
};

export const sendReminderEmail = async (user, reminderType) => {
  try {
    const streakResult = await pool.query(
      'SELECT current_streak FROM streaks WHERE user_id = $1',
      [user.id]
    );

    const streak = streakResult.rows[0]?.current_streak || 0;

    const subject = reminderType === 'morning'
      ? '🔥 25Hard Daily Challenge - Morning Reminder'
      : '⏰ 25Hard Daily Challenge - Evening Reminder';

    const htmlContent = `
      <h2>${subject}</h2>
      <p>Hi ${user.name}!</p>
      <p>Current Streak: <strong>${streak} days</strong> 🔥</p>
      <p>Today's checklist:</p>
      <ul>
        <li>✅ 2 Workouts</li>
        <li>📖 10 Pages in a Book</li>
        <li>🚫 No Alcohol</li>
        <li>🍬 No Sugar</li>
        <li>🥗 Clean Eating</li>
        <li>🚶 10k Steps</li>
        <li>📸 Upload a Photo</li>
      </ul>
      <p><strong>Check in before midnight!</strong></p>
      ${reminderType === 'evening' ? '<p>This is your last chance for today!</p>' : ''}
    `;

    await sgMail.send({
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: subject,
      html: htmlContent,
    });

    console.log(`Email sent to ${user.email} (${reminderType})`);
  } catch (err) {
    console.error(`Failed to send email to ${user.email}:`, err);
  }
};

export const sendSubmissionConfirmation = async (user, streak) => {
  try {
    const htmlContent = `
      <h2>✅ 25Hard Checklist Submitted!</h2>
      <p>Great job, ${user.name}!</p>
      <p>Your daily checklist has been submitted successfully.</p>
      <p><strong>Current Streak: ${streak} days 🔥</strong></p>
      <p>Keep it up!</p>
    `;

    await sgMail.send({
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: '✅ 25Hard - Checklist Submitted!',
      html: htmlContent,
    });

    console.log(`Confirmation email sent to ${user.email}`);
  } catch (err) {
    console.error(`Failed to send confirmation email to ${user.email}:`, err);
  }
};

export const initializeEmailScheduler = () => {
  console.log('Email scheduler initialized');

  // 6 AM reminder - Every day
  cron.schedule('0 6 * * *', () => {
    console.log('Sending 6 AM reminders...');
    USERS.forEach(user => sendReminderEmail(user, 'morning'));
  });

  // 6 PM reminder - Every day
  cron.schedule('0 18 * * *', () => {
    console.log('Sending 6 PM reminders...');
    USERS.forEach(user => sendReminderEmail(user, 'evening'));
  });

  // 12:15 AM - Check for missed days and send alerts
  cron.schedule('15 0 * * *', async () => {
    console.log('Checking for missed days...');
    const missedUsers = await checkAndResetStreaks();

    if (missedUsers && missedUsers.length > 0) {
      missedUsers.forEach(user => {
        const fullUser = USERS.find(u => u.id === user.id);
        if (fullUser) sendMissedDayAlert(fullUser);
      });
    }
  });
};
