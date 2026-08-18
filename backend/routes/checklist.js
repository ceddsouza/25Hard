import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadPhoto } from '../services/photoUpload.js';
import { updateStreak } from '../services/streakService.js';
import { sendSubmissionConfirmation } from '../services/emailScheduler.js';

const router = express.Router();

router.post('/submit', authenticateToken, async (req, res) => {
  const { workout_1, workout_2, reading_pages, no_alcohol, no_sugar, clean_eating, steps_10k, photo } = req.body;
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  // Check if challenge has started (Sept 7, 2026)
  const challengeStart = new Date('2026-09-07');
  const currentDate = new Date(today);
  if (currentDate < challengeStart) {
    return res.status(400).json({ error: 'Challenge starts on September 7, 2026. Please check back then!' });
  }

  try {
    let photoUrl = null;
    if (photo) {
      photoUrl = await uploadPhoto(photo, userId, today);
    }

    const isCompleted = workout_1 && workout_2 && reading_pages >= 10 && no_alcohol && no_sugar && clean_eating && steps_10k && photo;

    const result = await pool.query(
      `INSERT INTO daily_logs (user_id, log_date, workout_1, workout_2, reading_pages, no_alcohol, no_sugar, clean_eating, steps_10k, photo_url, completed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (user_id, log_date) DO UPDATE SET
       workout_1 = $3, workout_2 = $4, reading_pages = $5, no_alcohol = $6, no_sugar = $7, clean_eating = $8, steps_10k = $9, photo_url = $10, completed = $11, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, today, workout_1, workout_2, reading_pages, no_alcohol, no_sugar, clean_eating, steps_10k, photoUrl, isCompleted]
    );

    if (isCompleted) {
      await updateStreak(userId, true);

      // Send confirmation email
      const streakResult = await pool.query('SELECT current_streak FROM streaks WHERE user_id = $1', [userId]);
      const streak = streakResult.rows[0]?.current_streak || 1;
      const USERS = [
        { id: 1, name: "Cedric D'Souza", email: 'ced.dsouza@gmail.com' },
        { id: 2, name: 'Nader Merhi', email: 'marcomerhi@gmail.com' },
        { id: 3, name: 'Rahil Hoque', email: 'rahilhoque@gmail.com' },
      ];
      const user = USERS.find(u => u.id === userId);
      if (user) {
        await sendSubmissionConfirmation(user, streak);
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Checklist submission error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to submit checklist', details: err.message });
  }
});

router.get('/today', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const result = await pool.query(
      'SELECT * FROM daily_logs WHERE user_id = $1 AND log_date = $2',
      [userId, today]
    );

    if (result.rows.length === 0) {
      return res.json({
        id: null,
        workout_1: false,
        workout_2: false,
        reading_pages: 0,
        no_alcohol: false,
        no_sugar: false,
        clean_eating: false,
        steps_10k: false,
        photo_url: null,
        completed: false,
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch today\'s checklist' });
  }
});

router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM daily_logs WHERE user_id = $1 ORDER BY log_date DESC LIMIT 30',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
