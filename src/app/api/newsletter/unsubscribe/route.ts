import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ ok: false, message: 'Token inválido.' }, { status: 400 });
  }

  await db.query(
    `DELETE FROM newsletter_subscribers WHERE unsubscribe_token = $1 RETURNING email`,
    [token]
  );

  // Render HTML de confirmação
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Inscrição cancelada</title>
        <style>
          body { font-family: Arial, sans-serif; background: #fdf2f8; color: #111827; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #fff; padding: 32px; border-radius: 16px; max-width: 480px; width: 90%; text-align: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
          h1 { font-size: 22px; margin-bottom: 12px; }
          p { color: #374151; font-size: 14px; line-height: 1.6; }
          a { color: #ec4899; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Inscrição cancelada</h1>
          <p>Seu e-mail foi removido da nossa lista de novidades da <strong>Play Vision Papelaria</strong>.</p>
          <p>Não mandaremos mais e-mails para você. 😊</p>
          <p><a href="/">Voltar para o site</a></p>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
