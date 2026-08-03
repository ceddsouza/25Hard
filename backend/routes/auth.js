import express from 'express';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import pool from '../db.js';

const router = express.Router();

const USERS = [
  { id: 1, name: "Cedric D'Souza", email: 'ced.dsouza@gmail.com' },
  { id: 2, name: 'Nader Merhi', email: 'marcomerhi@gmail.com' },
  { id: 3, name: 'Rahil Hoque', email: 'rahilhoque@gmail.com' },
];

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (password !== process.env.CHALLENGE_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.json({ token, user });
});

router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = USERS.find(u => u.id === decoded.id);
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
