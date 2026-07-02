require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  const sql = `
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_number text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address_complement text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS neighborhood text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reference text;
`;
  await pool.query(sql);
  console.log('OK');
})()
  .catch((e) => {
    console.log('ERR', e.message);
    process.exit(1);
  })
  .finally(() => pool.end());
