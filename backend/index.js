import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mockPool from './db-mock.js';
import authRoutes from './routes/auth.js';
import checklistRoutes from './routes/checklist.js';
import streakRoutes from './routes/streak.js';
import leaderboardRoutes from './routes/leaderboard.js';
import { initializeEmailScheduler } from './services/emailScheduler.js';

dotenv.config();

// Use mock database for local testing
const pool = mockPool;
console.log('⚠️  Using mock database (local testing mode)');

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
