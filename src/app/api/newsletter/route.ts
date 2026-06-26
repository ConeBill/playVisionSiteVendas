import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { db } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'Play Vision Papelaria <newsletter@emails.conebilservices.com>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';

function generateUnsubscribeToken(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || 'fallback-secret';
  const data = `${Date.now()}-${Math.random()}`;
  // Simple HMAC-like token without extra deps: btoa + suffix
  return Buffer.from(`${data}:${Buffer.from(data).toString('base64').slice(0, 8)}`).toString('base64url');
}

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

  // Migration para tabelas já existentes
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

function getClientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return 'unknown';
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const rateMap = new Map<string, { count: number; first: number }>();

export async function POST(request: Request) {
  try {
    await ensureNewsletterTable();

    const ip = getClientIp(request);
    const now = Date.now();
    const bucket = rateMap.get(ip);

    if (!bucket || now - bucket.first > RATE_LIMIT_WINDOW_MS) {
      rateMap.set(ip, { count: 1, first: now });
    } else {
      bucket.count += 1;
      if (bucket.count > RATE_LIMIT_MAX) {
        return NextResponse.json(
          { ok: false, message: 'Muitas tentativas. Tente novamente em 1 minuto.' },
          { status: 429 }
        );
      }
    }

    const json = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: 'E-mail inválido.' }, { status: 400 });
    }

    const { email } = parsed.data;

    const result = await db.query(
      `INSERT INTO newsletter_subscribers (email, unsubscribe_token)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET email = newsletter_subscribers.email
       RETURNING id, unsubscribe_token`,
      [email, generateUnsubscribeToken()]
    );

    const token = result.rows[0]?.unsubscribe_token;
    const unsubscribeLink = `${BASE_URL}/unsubscribe?token=${encodeURIComponent(token as string)}`;

    const resendResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Novidades da Play Vision Papelaria',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h1 style="color: #111827;">Bem-vindo à Play Vision Papelaria 🌸</h1>
          <p style="color: #374151;">Agora você faz parte da nossa lista e vai receber ofertas, lançamentos e novidades com o mesmo carinho de quem escolhe cada item da loja.</p>
          <p style="color: #374151;">Aproveite e visite nosso catálogo:</p>
          <p><a href="https://app.conebilservices.com/catalog" style="color: #ec4899;">Ver produtos</a></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #6b7280; font-size: 12px;">Se não quiser receber mais novidades, cancelue a inscrição: <a href="${unsubscribeLink}" style="color: #ec4899;">Cancelar inscrição</a>.</p>
        </div>
      `,
      replyTo: 'contato@emails.conebilservices.com',
    });

    return NextResponse.json({ ok: true, subscriberId: result.rows[0]?.id, emailId: resendResult.data?.id ?? null });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { ok: false, message: 'Não foi possível concluir a inscrição agora.' },
      { status: 500 }
    );
  }
}
