'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Falha no cadastro.');
        setLoading(false);
        return;
      }
      await signIn('credentials', { email, password, callbackUrl: '/' });
    } catch (err) {
      setError('Erro inesperado.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <input name="name" type="text" required className="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" type="email" required className="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Senha</label>
        <input name="password" type="password" required minLength={6} className="w-full rounded border px-3 py-2" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} type="submit" className="w-full rounded bg-primary text-white py-2">
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>
      <button type="button" onClick={() => signIn('google', { callbackUrl: '/' })} className="w-full rounded border py-2">
        Cadastrar com Google
      </button>
    </form>
  );
}
