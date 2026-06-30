import { Pool } from 'pg';
import { config } from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

try {
  const envPath = resolve(process.cwd(), '.env.local');
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (key) process.env[key.trim()] = rest.join('=').trim();
    }
  }
} catch {}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sql = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    email_verified TIMESTAMP,
    password_hash TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
`;

(async () => {
  try {
    const res = await pool.query(sql);
    console.log('Tabela users criada/verificada com sucesso no Neon.');
  } catch (err) {
    console.error('Erro ao criar tabela users:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
