import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ current_streak: 0, last_check_in: null, missed_day_count: 0 });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch streak' });
  }
});

router.post('/continue-streak', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const streakResult = await pool.query(
      'UPDATE streaks SET current_streak = 0, missed_day_count = missed_day_count + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *',
      [userId]
    );

    res.json({ message: 'Paid $10 to continue streak', streak: streakResult.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to continue streak' });
  }
});

export default router;
