import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import mockPool from './db-mock.js';

dotenv.config();

let pool;

// Use mock database if credentials are missing or invalid
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.log('⚠️  Database credentials not found. Using mock database.');
  pool = mockPool;
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
  });

  pool.on('error', (err) => {
    console.warn('Database connection warning:', err.message);
  });
}

export default pool;
