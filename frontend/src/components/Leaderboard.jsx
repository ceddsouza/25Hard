import { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

export default function Leaderboard({ token }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [token]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <div className="rank">Rank</div>
          <div className="name">Name</div>
          <div className="streak">🔥 Streak</div>
          <div className="days">✅ Days</div>
        </div>

        {leaderboard.map((user, index) => (
          <div key={user.id} className={`leaderboard-row ${index === 0 ? 'leader' : ''}`}>
            <div className="rank">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </div>
            <div className="name">{user.name}</div>
            <div className="streak">
              <span className="streak-value">{user.current_streak}</span> days
            </div>
            <div className="days">{user.days_completed || 0}</div>
          </div>
        ))}
      </div>

      <div className="challenge-info">
        <h3>Challenge Dates</h3>
        <p>Start: September 7, 2026</p>
        <p>End: October 2, 2026</p>
        <p className="duration">26 Days of Accountability</p>
      </div>
    </div>
  );
}
