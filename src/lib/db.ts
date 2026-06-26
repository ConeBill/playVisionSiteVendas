import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}

const globalPool = globalThis as unknown as {
  pgPool?: Pool;
};

export const db =
  globalPool.pool ??
  new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== 'production') {
  globalPool.pool = db;
}

export default db;
