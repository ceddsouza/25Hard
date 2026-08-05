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
    // Return hardcoded leaderboard with all users and their streak data
    const leaderboard = USERS.map(user => {
      const streakData = pool.query ?
        (async () => {
          const result = await pool.query('SELECT * FROM streaks WHERE user_id = $1', [user.id]);
          return result.rows[0] || { current_streak: 0, last_check_in: null };
        })() :
        Promise.resolve({ current_streak: 0, last_check_in: null });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        current_streak: 0,
        days_completed: 0,
        last_check_in: null,
      };
    });

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
