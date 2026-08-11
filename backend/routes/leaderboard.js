import express from 'express';
import pool from '../db.js';

const router = express.Router();

const USERS = [
  { id: 1, name: "Cedric D'Souza", email: 'ced.dsouza@gmail.com' },
  { id: 2, name: 'Nader Merhi', email: 'marcomerhi@gmail.com' },
  { id: 3, name: 'Rahil Hoque', email: 'rahilhoque@gmail.com' },
];

router.get('/', async (req, res) => {
  try {
    const leaderboard = await Promise.all(
      USERS.map(async user => {
        const streakResult = await pool.query('SELECT * FROM streaks WHERE user_id = $1', [user.id]);
        const streak = streakResult.rows[0] || { current_streak: 0, last_check_in: null };

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          current_streak: streak.current_streak || 0,
          last_check_in: streak.last_check_in,
          days_completed: 0,
        };
      })
    );

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
