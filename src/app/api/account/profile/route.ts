import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { encrypt } from '../../../../lib/crypto';

export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const res = await db.query('SELECT name, email, phone, cpf, address, address_number, address_complement, neighborhood, city, state, zip_code, reference FROM users WHERE id = $1', [userId]);
    const user = res.rows[0];
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: 'Falha ao buscar perfil.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const body = await request.json() as Record<string, any>;
    const encryptable = ['phone','cpf','address','address_number','address_complement','neighborhood','city','state','zip_code','reference'];
    const updates: Record<string, any> = {};
    for (const [key, value] of Object.entries(body)) {
      if (!['name','email',...encryptable].includes(key)) continue;
      if (['phone','cpf','address','address_number','address_complement','neighborhood','city','state','zip_code','reference'].includes(key) && value) {
        updates[key] = encrypt(value);
      } else if (key === 'name' || key === 'email') {
        updates[key] = value;
      }
    }

    if (!Object.keys(updates).length) return NextResponse.json({ ok: true });

    const setClause = Object.keys(updates).map((key, idx) => `${key} = $${idx + 2}`).join(', ');
    const values = [userId, ...Object.values(updates)];
    await db.query(`UPDATE users SET ${setClause} WHERE id = $1`, values);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Falha ao atualizar perfil.' }, { status: 500 });
  }
}
