import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import db from '../../../../src/lib/db';
import { authOptions } from '../../../../src/lib/auth';

function favId() {
  return `fav_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function ok(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const userId = session?.user?.id;
    if (!userId) return ok({ favorites: [] }, 401);

    const res = await db.query(
      `SELECT f.product_id, p.name, p.price, p.images
       FROM favorites f
       JOIN products p ON p.id = f.product_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    return ok({ favorites: res.rows });
  } catch (err) {
    return NextResponse.json({ error: 'Falha ao buscar favoritos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const { productId } = await request.json() as Record<string, any>;
    if (!productId) return NextResponse.json({ error: 'productId obrigatório.' }, { status: 400 });

    await db.query(
      'INSERT INTO favorites (id, user_id, product_id) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO NOTHING',
      [favId(), userId, productId]
    );

    return ok({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Falha ao favoritar.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const { productId } = await request.json() as Record<string, any>;
    if (!productId) return NextResponse.json({ error: 'productId obrigatório.' }, { status: 400 });

    await db.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [userId, productId]);

    return ok({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Falha ao remover favorito.' }, { status: 500 });
  }
}
