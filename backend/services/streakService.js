import pool from '../db.js';

export const updateStreak = async (userId, completed) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const streakResult = await pool.query(
      'SELECT * FROM streaks WHERE user_id = $1',
      [userId]
    );

    let streak = streakResult.rows[0];

    if (!streak) {
      streak = await pool.query(
        `INSERT INTO streaks (user_id, current_streak, last_check_in)
         VALUES ($1, 1, $2)
         RETURNING *`,
        [userId, today]
      );
      return streak.rows[0];
    }

    if (completed) {
      const lastCheckInStr = streak.last_check_in ? streak.last_check_in.toString().split('T')[0] : null;
      let newStreak = streak.current_streak + 1;

      if (lastCheckInStr && lastCheckInStr !== today) {
        // Calculate day difference by parsing date strings directly
        const [lastYear, lastMonth, lastDay] = lastCheckInStr.split('-').map(Number);
        const [todayYear, todayMonth, todayDay] = today.split('-').map(Number);

        const lastDate = new Date(lastYear, lastMonth - 1, lastDay);
        const todayDate = new Date(todayYear, todayMonth - 1, todayDay);
        const dayDiff = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        console.log(`Streak check: userId=${userId}, last=${lastCheckInStr}, today=${today}, dayDiff=${dayDiff}`);

        // Reset streak only if more than 1 day has passed (missed at least one day)
        if (dayDiff > 1) {
          console.log(`Resetting streak (dayDiff=${dayDiff} > 1)`);
          newStreak = 1; // Reset if missed more than 1 day
        }
      }

      await pool.query(
        'UPDATE streaks SET current_streak = $1, last_check_in = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3',
        [newStreak, today, userId]
      );
    } else {
      await pool.query(
        'UPDATE streaks SET current_streak = 0, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1',
        [userId]
      );
    }

    return await pool.query('SELECT * FROM streaks WHERE user_id = $1', [userId]);
  } catch (err) {
    console.error('Streak update error:', err);
  }
};

export const checkAndResetStreaks = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const usersWithoutYesterdayLog = await pool.query(
      `SELECT u.id, u.email FROM users u
       WHERE NOT EXISTS (
         SELECT 1 FROM daily_logs dl WHERE dl.user_id = u.id AND dl.log_date = $1 AND dl.completed = true
       )`,
      [yesterdayStr]
    );

    for (const user of usersWithoutYesterdayLog.rows) {
      await updateStreak(user.id, false);
    }

    return usersWithoutYesterdayLog.rows;
  } catch (err) {
    console.error('Check and reset streaks error:', err);
  }
};
