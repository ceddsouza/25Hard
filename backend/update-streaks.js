import pool from './db.js';

async function updateStreaks() {
  try {
    // Update Cedric D'Souza (id: 1) to 3 days
    await pool.query(
      'UPDATE streaks SET current_streak = $1 WHERE user_id = $2',
      [3, 1]
    );
    console.log('✅ Cedric updated to 3 days');

    // Update Nader Merhi (id: 2) to 2 days
    await pool.query(
      'UPDATE streaks SET current_streak = $1 WHERE user_id = $2',
      [2, 2]
    );
    console.log('✅ Nader updated to 2 days');

    // Update Rahil Hoque (id: 3) to 3 days
    await pool.query(
      'UPDATE streaks SET current_streak = $1 WHERE user_id = $2',
      [3, 3]
    );
    console.log('✅ Rahil updated to 3 days');

    // Verify updates
    const result = await pool.query('SELECT user_id, current_streak FROM streaks ORDER BY user_id');
    console.log('\n📊 Updated streaks:');
    result.rows.forEach(row => {
      const names = {1: 'Cedric', 2: 'Nader', 3: 'Rahil'};
      console.log(`${names[row.user_id]}: ${row.current_streak} days`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

updateStreaks();
