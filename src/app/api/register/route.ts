import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = schema.parse(body);

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return NextResponse.json({ error: 'Email já cadastrado.' }, { status: 409 });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    await db.query(
      'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4)',
      [id, name, email, password_hash]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Falha no cadastro.' }, { status: 400 });
  }
}
