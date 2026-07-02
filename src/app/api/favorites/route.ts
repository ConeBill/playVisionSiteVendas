import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import db from '../../../lib/db';
import { authOptions } from '../../../lib/auth';

function favId() {
  return `fav_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function ok(body: any, status = 200) {
  return NextResponse.json(body, { status });
}

async function resolveUserId(session: any): Promise<string | null> {
  if (session?.user?.id) return session.user.id as string;
  if (!session?.user?.email) return null;

  const res = await db.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [
    session.user.email,
  ]);
  const row = res.rows[0];
  return row?.id ?? null;
}

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = await resolveUserId(session);
    if (!userId) return ok({ error: 'Não autorizado.', favorites: [] }, 401);

    const res = await db.query(
      `SELECT product_id, product_name, product_image, product_price, product_slug, created_at
       FROM favorites
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return ok({ favorites: res.rows });
  } catch (err) {
    console.error('GET /api/favorites error', err);
    return ok({ error: 'Falha ao buscar favoritos.' }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = await resolveUserId(session);
    if (!userId) return ok({ error: 'Não autorizado.' }, 401);

    let body: Record<string, any> = {};
    try {
      body = (await request.json()) as Record<string, any>;
    } catch {
      return ok({ error: 'Body JSON inválido.' }, 400);
    }

    const { productId, productName, productImage, productPrice, productSlug } = body;
    if (!productId) return ok({ error: 'productId obrigatório.' }, 400);

    await db.query(
      `INSERT INTO favorites (id, user_id, product_id, product_name, product_image, product_price, product_slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, product_id) DO UPDATE SET product_name = EXCLUDED.product_name, product_image = EXCLUDED.product_image, product_price = EXCLUDED.product_price, product_slug = EXCLUDED.product_slug`,
      [favId(), userId, productId, productName || null, productImage || null, productPrice || null, productSlug || null]
    );

    return ok({ ok: true });
  } catch (err) {
    console.error('POST /api/favorites error', err);
    return ok({ error: 'Falha ao favoritar.' }, 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;
    const userId = await resolveUserId(session);
    if (!userId) return ok({ error: 'Não autorizado.' }, 401);

    let body: Record<string, any> = {};
    try {
      body = (await request.json()) as Record<string, any>;
    } catch {
      return ok({ error: 'Body JSON inválido.' }, 400);
    }

    if (!body?.productId) return ok({ error: 'productId obrigatório.' }, 400);

    await db.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [userId, body.productId]);

    return ok({ ok: true });
  } catch (err) {
    console.error('DELETE /api/favorites error', err);
    return ok({ error: 'Falha ao remover favorito.' }, 500);
  }
}
