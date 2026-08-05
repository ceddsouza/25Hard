import pool from './db.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const runSchema = async () => {
  try {
    const schema = readFileSync(join(process.cwd(), 'schema.sql'), 'utf-8');

    // Split by semicolon and filter empty statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      console.log(`Executing: ${statement.trim().substring(0, 50)}...`);
      await pool.query(statement);
    }

    console.log('✅ Database schema created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating schema:', err.message);
    process.exit(1);
  }
};

runSchema();
