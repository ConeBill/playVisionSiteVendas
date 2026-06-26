import { config } from 'dotenv';
import { Pool } from 'pg';

config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : { rejectUnauthorized: false },
});

const sql = `
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);
`;

try {
  const result = await pool.query(sql);
  console.log('Tabela newsletter_subscribers criada/verificada com sucesso.');
} catch (error) {
  console.error('Erro ao criar tabela newsletter:', error);
  process.exit(1);
} finally {
  await pool.end();
}
