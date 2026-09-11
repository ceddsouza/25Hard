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
    // Set correct streaks: Cedric 4, Nader 3, Rahil 3 with last_check_in Sept 10
    const updates = [
      { userId: 1, streak: 4 },
      { userId: 2, streak: 3 },
      { userId: 3, streak: 3 },
    ];

    for (const update of updates) {
      await pool.query(
        'UPDATE streaks SET current_streak = $1, last_check_in = $2 WHERE user_id = $3',
        [update.streak, '2026-09-10', update.userId]
      );
    }
    console.log('✅ Streaks initialized correctly');
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
