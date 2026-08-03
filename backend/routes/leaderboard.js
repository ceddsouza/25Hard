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
    const result = await pool.query(
      `SELECT s.user_id, s.current_streak, s.last_check_in,
              COUNT(CASE WHEN dl.completed = true THEN 1 END) as days_completed
       FROM streaks s
       LEFT JOIN daily_logs dl ON s.user_id = dl.user_id
       GROUP BY s.user_id, s.current_streak, s.last_check_in
       ORDER BY s.current_streak DESC, days_completed DESC`
    );

    const leaderboard = result.rows.map(row => {
      const user = USERS.find(u => u.id === row.user_id);
      return {
        ...user,
        current_streak: row.current_streak,
        days_completed: row.days_completed || 0,
        last_check_in: row.last_check_in,
      };
    });

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
