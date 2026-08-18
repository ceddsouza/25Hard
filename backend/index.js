import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import checklistRoutes from './routes/checklist.js';
import streakRoutes from './routes/streak.js';
import leaderboardRoutes from './routes/leaderboard.js';
import { initializeEmailScheduler } from './services/emailScheduler.js';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

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
  initializeEmailScheduler();
});
