import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { encrypt } from '../../../../lib/crypto';

function safeDecrypt(value: string | null | undefined) {
  if (!value || typeof value !== 'string') return value ?? '';
  try {
    const { decrypt } = require('../../../../lib/crypto');
    return decrypt(value);
  } catch {
    return value;
  }
}

export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

    const res = await db.query('SELECT name, email, phone, cpf, address, address_number, address_complement, neighborhood, city, state, zip_code, reference FROM users WHERE id = $1', [userId]);
    const user = res.rows[0];
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });

    const safe = {
      name: user.name,
      email: user.email,
      phone: safeDecrypt(user.phone),
      cpf: safeDecrypt(user.cpf),
      address: safeDecrypt(user.address),
      address_number: safeDecrypt(user.address_number),
      address_complement: safeDecrypt(user.address_complement),
      neighborhood: safeDecrypt(user.neighborhood),
      city: safeDecrypt(user.city),
      state: safeDecrypt(user.state),
      zip_code: safeDecrypt(user.zip_code),
      reference: safeDecrypt(user.reference),
    };

    return NextResponse.json({ user: safe });
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
    for (const key of Object.keys(body)) {
      if (!['name','email',...encryptable].includes(key)) continue;
      const value = body[key];
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
