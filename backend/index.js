import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import checklistRoutes from './routes/checklist.js';
import streakRoutes from './routes/streak.js';
import leaderboardRoutes from './routes/leaderboard.js';
import { initializeEmailScheduler } from './services/emailScheduler.js';
import pool from './db.js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const initializeStreaks = async () => {
  try {
    // Set streaks with today's date (Sept 15) to enable proper increment logic
    // Cedric: 9 (just submitted today, so it incremented from 8)
    // Nader & Rahil: 5 with today's date so they increment to 6 when they submit
    const today = new Date().toISOString().split('T')[0];

    const updates = [
      { userId: 1, streak: 11, date: today }, // Cedric - 11
      { userId: 2, streak: 7, date: today }, // Nader - 7
      { userId: 3, streak: 6, date: today }, // Rahil - 6
    ];

    for (const update of updates) {
      await pool.query(
        'UPDATE streaks SET current_streak = $1, last_check_in = $2 WHERE user_id = $3',
        [update.streak, update.date, update.userId]
      );
    }
    console.log(`✅ Streaks: Cedric 11, Nader 7, Rahil 8 (today: ${today})`);
  } catch (err) {
    console.error('Streak initialization warning:', err.message);
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/test-email', async (req, res) => {
  try {
    const { sendReminderEmail } = await import('./services/emailScheduler.js');
    const user = { id: 1, name: "Cedric D'Souza", email: 'ced.dsouza@gmail.com' };
    await sendReminderEmail(user, 'morning');
    res.json({ success: true, message: 'Test email sent to ' + user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeStreaks();
  initializeEmailScheduler();
});
