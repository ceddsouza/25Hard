// Mock database for local testing
const mockData = {
  users: [
    { id: 1, name: "Cedric D'Souza", email: 'ced.dsouza@gmail.com' },
    { id: 2, name: 'Nader Merhi', email: 'marcomerhi@gmail.com' },
    { id: 3, name: 'Rahil Hoque', email: 'rahilhoque@gmail.com' },
  ],
  dailyLogs: {},
  streaks: {
    1: { user_id: 1, current_streak: 0, last_check_in: null, missed_day_count: 0 },
    2: { user_id: 2, current_streak: 0, last_check_in: null, missed_day_count: 0 },
    3: { user_id: 3, current_streak: 0, last_check_in: null, missed_day_count: 0 },
  },
};

export class MockPool {
  async query(sql, params) {
    // Handle login query
    if (sql.includes('INSERT INTO daily_logs') || sql.includes('ON CONFLICT')) {
      const [userId, logDate, w1, w2, pages, noAlc, clean, photo, completed] = params;
      const key = `${userId}_${logDate}`;
      mockData.dailyLogs[key] = {
        id: Object.keys(mockData.dailyLogs).length + 1,
        user_id: userId,
        log_date: logDate,
        workout_1: w1,
        workout_2: w2,
        reading_pages: pages,
        no_alcohol: noAlc,
        clean_eating: clean,
        photo_url: photo,
        completed: completed,
      };
      return { rows: [mockData.dailyLogs[key]] };
    }

    if (sql.includes('SELECT * FROM daily_logs WHERE user_id') && sql.includes('log_date')) {
      const [userId, logDate] = params;
      const key = `${userId}_${logDate}`;
      const log = mockData.dailyLogs[key];
      return { rows: log ? [log] : [] };
    }

    if (sql.includes('SELECT * FROM streaks WHERE user_id')) {
      const [userId] = params;
      const streak = mockData.streaks[userId];
      if (!streak) {
        // Create default streak if doesn't exist
        mockData.streaks[userId] = { user_id: userId, current_streak: 0, last_check_in: null, missed_day_count: 0 };
      }
      return { rows: [mockData.streaks[userId]] };
    }

    if (sql.includes('UPDATE streaks SET current_streak')) {
      const [newStreak, userId] = [params[0], params[2]];
      mockData.streaks[userId].current_streak = newStreak;
      return { rows: [mockData.streaks[userId]] };
    }

    if (sql.includes('UPDATE streaks SET current_streak = 0')) {
      const [userId] = [params[0]];
      mockData.streaks[userId].current_streak = 0;
      return { rows: [mockData.streaks[userId]] };
    }

    if (sql.includes('SELECT s.user_id, s.current_streak')) {
      const streaks = Object.values(mockData.streaks);
      return {
        rows: streaks.map(s => ({
          user_id: s.user_id,
          current_streak: s.current_streak,
          last_check_in: s.last_check_in,
          days_completed: Object.values(mockData.dailyLogs).filter(l => l.user_id == s.user_id && l.completed).length,
        })),
      };
    }

    if (sql.includes('SELECT * FROM daily_logs WHERE user_id') && !sql.includes('log_date')) {
      const [userId] = params;
      const logs = Object.values(mockData.dailyLogs).filter(l => l.user_id == userId);
      return { rows: logs };
    }

    console.log('Unhandled query:', sql.substring(0, 50));
    return { rows: [] };
  }

  on(event, handler) {
    // Mock event handler
  }
}

export default new MockPool();
