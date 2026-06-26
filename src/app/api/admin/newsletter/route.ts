import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const ADMIN_PASSWORD = process.env.NEWSLETTER_ADMIN_PASSWORD;
const SESSION_COOKIE = 'newsletter_admin_session';

const bodySchema = z.object({ email: z.string().email() });

async function ensureNewsletterTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      confirmed_at TIMESTAMPTZ,
      unsubscribe_token TEXT UNIQUE
    );
  `);

  await db.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'newsletter_subscribers' AND column_name = 'unsubscribe_token'
      ) THEN
        ALTER TABLE newsletter_subscribers ADD COLUMN unsubscribe_token TEXT UNIQUE;
      END IF;
    END;
    $$;
  `);
}

function setSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, 'ok', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get(SESSION_COOKIE)?.value === 'ok';
}

export async function POST(request: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, message: 'Admin não configurado.' }, { status: 500 });
  }

  const json = await request.json().catch(() => null);
  const body = (json as Record<string, unknown> | null) || {};

  if (body._logout === true && isAuthenticated(request)) {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  if (!isAuthenticated(request)) {
    const password = typeof body.password === 'string' ? body.password : '';
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, message: 'Senha inválida.' }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    setSession(res);
    return res;
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'E-mail inválido.' }, { status: 400 });
  }

  const { email } = parsed.data;
  await ensureNewsletterTable();

  const result = await db.query(
    `DELETE FROM newsletter_subscribers WHERE email = $1 RETURNING id, email`,
    [email]
  );

  if (!result.rowCount) {
    return NextResponse.json({ ok: false, message: 'E-mail não encontrado.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ ok: false, message: 'Não autorizado.' }, { status: 401 });
  }

  await ensureNewsletterTable();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || 15)));
  const offset = (page - 1) * limit;

  const [countResult, listResult] = await Promise.all([
    db.query(`SELECT COUNT(*) as total FROM newsletter_subscribers`),
    db.query(
      `SELECT id, email, created_at, unsubscribe_token FROM newsletter_subscribers ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
  ]);

  const total = Number(countResult.rows[0]?.total || 0);

  return NextResponse.json({
    ok: true,
    total,
    page,
    limit,
    subscribers: listResult.rows,
  });
}
