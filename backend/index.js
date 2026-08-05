import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import checklistRoutes from './routes/checklist.js';
import streakRoutes from './routes/streak.js';
import leaderboardRoutes from './routes/leaderboard.js';
import { initializeEmailScheduler } from './services/emailScheduler.js';

dotenv.config();

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeEmailScheduler();
});
