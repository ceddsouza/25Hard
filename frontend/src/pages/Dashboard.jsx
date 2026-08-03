import { useState, useEffect } from 'react';
import Checklist from '../components/Checklist';
import Leaderboard from '../components/Leaderboard';
import StreakDisplay from '../components/StreakDisplay';
import '../styles/Dashboard.css';

export default function Dashboard({ user, token, onLogout }) {
  const [activeTab, setActiveTab] = useState('checklist');
  const [streak, setStreak] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchStreak();
  }, [token, refreshTrigger]);

  const fetchStreak = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/streak/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setStreak(data);
    } catch (err) {
      console.error('Failed to fetch streak:', err);
    }
  };

  const handleChecklistSubmit = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🔥 25Hard Challenge</h1>
          <p className="user-name">Welcome, {user.name}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </header>

      {streak && <StreakDisplay streak={streak} />}

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          📋 Today's Checklist
        </button>
        <button
          className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Leaderboard
        </button>
      </nav>

      <div className="tab-content">
        {activeTab === 'checklist' && (
          <Checklist user={user} token={token} onSubmit={handleChecklistSubmit} />
        )}
        {activeTab === 'leaderboard' && (
          <Leaderboard token={token} />
        )}
      </div>
    </div>
  );
}
