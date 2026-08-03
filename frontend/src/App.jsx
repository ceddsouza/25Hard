import { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser(decoded);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="app">
      {!token ? (
        <Login onLogin={(t) => { setToken(t); localStorage.setItem('token', t); }} />
      ) : (
        <Dashboard user={user} token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}
