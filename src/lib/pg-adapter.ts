import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const pgAdapter = {
  async createUser(profile: any) {
    const id = profile.id ?? `user_${Date.now()}`;
    const name = profile.name ?? null;
    const email = profile.email ?? null;
    const emailVerified = profile.email_verified ? new Date() : null;
    const image = profile.image ?? null;
    const passwordHash = profile.passwordHash ?? null;

    await pool.query(
      `INSERT INTO users (id, name, email, email_verified, image, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, image = EXCLUDED.image`,
      [id, name, email, emailVerified, image, passwordHash]
    );

    return {
      id,
      name,
      email,
      emailVerified,
      image,
    };
  },

  async getUser(id: string) {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = res.rows[0];
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.email_verified,
      image: user.image,
    };
  },

  async getUserByEmail(email: string) {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] ?? null;
  },

  async updateUser(profile: any) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const key of ['name', 'email', 'email_verified', 'image', 'password_hash']) {
      if (profile[key] !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(profile[key]);
      }
    }

    if (!fields.length) return null;

    values.push(profile.id);
    const res = await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return res.rows[0];
  },

  async deleteUser(id: string) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },

  async linkAccount(profile: any) {
    const userId = profile.userId;
    const provider = profile.provider;
    const providerAccountId = profile.providerAccountId;

    await pool.query(
      `INSERT INTO accounts (user_id, provider, provider_account_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (provider, provider_account_id) DO NOTHING`,
      [userId, provider, providerAccountId]
    );
  },

  async unlinkAccount(userId: string, provider: string, providerAccountId: string) {
    await pool.query(
      'DELETE FROM accounts WHERE user_id = $1 AND provider = $2 AND provider_account_id = $3',
      [userId, provider, providerAccountId]
    );
  },

  async createSession(session: any) {
    const expiresDate = session.expires instanceof Date ? session.expires : new Date(session.expires);

    // Tenta INSERT; se já existir (conflito em session_token), faz UPDATE e retorna a sessão.
    const insertRes = await pool.query(
      `INSERT INTO sessions (session_token, user_id, expires)
       VALUES ($1, $2, $3)
       RETURNING session_token, user_id, expires`,
      [session.sessionToken, session.userId, expiresDate]
    );

    const row = insertRes.rows[0];
    return {
      sessionToken: row.session_token,
      userId: row.user_id,
      expires: row.expires,
    };
  },

  async getSession(sessionToken: string) {
    const res = await pool.query(
      `SELECT s.session_token, s.user_id, s.expires, u.id, u.name, u.email, u.email_verified, u.image
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_token = $1`,
      [sessionToken]
    );
    const row = res.rows[0];
    if (!row) return null;
    return {
      sessionToken: row.session_token,
      userId: row.user_id,
      expires: row.expires,
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
        emailVerified: row.email_verified,
        image: row.image,
      },
    };
  },

  async updateSession(session: any) {
    const expiresDate = session.expires instanceof Date ? session.expires : new Date(session.expires);

    const res = await pool.query(
      `UPDATE sessions SET expires = $1 WHERE session_token = $2
       RETURNING session_token, user_id, expires`,
      [expiresDate, session.sessionToken]
    );

    const row = res.rows[0];
    return {
      sessionToken: row.session_token,
      userId: row.user_id,
      expires: row.expires,
    };
  },

  async deleteSession(sessionToken: string) {
    await pool.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
  },

  async createVerificationToken(verificationToken: any) {
    const expiresAt = new Date(verificationToken.expires);
    await pool.query(
      `INSERT INTO verification_tokens (identifier, token, expires)
       VALUES ($1, $2, $3)`,
      [verificationToken.identifier, verificationToken.token, expiresAt]
    );
    return verificationToken;
  },

  async useVerificationToken(params: { identifier: string; token: string }) {
    const { identifier, token } = params;

    const res = await pool.query(
      'SELECT * FROM verification_tokens WHERE identifier = $1 AND token = $2',
      [identifier, token]
    );

    const row = res.rows[0];
    if (!row) return null;

    await pool.query(
      'DELETE FROM verification_tokens WHERE identifier = $1 AND token = $2',
      [identifier, token]
    );

    return {
      identifier: row.identifier,
      token: row.token,
      expires: row.expires,
    };
  },
};
