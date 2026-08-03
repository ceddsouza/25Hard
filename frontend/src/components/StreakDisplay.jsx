import '../styles/StreakDisplay.css';

export default function StreakDisplay({ streak }) {
  return (
    <div className="streak-display">
      <div className="streak-card">
        <h2 className="streak-title">Your Current Streak</h2>
        <div className="streak-number">
          <span className="flame">🔥</span>
          <span className="count">{streak.current_streak || 0}</span>
          <span className="flame">🔥</span>
        </div>
        <p className="streak-subtitle">days in a row</p>
        {streak.last_check_in && (
          <p className="last-check-in">Last check-in: {new Date(streak.last_check_in).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}
