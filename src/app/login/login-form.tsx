'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const search = useSearchParams();
  const callbackUrl = search.get('callbackUrl') || '/';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await signIn('credentials', {
        email: form.get('email'),
        password: form.get('password'),
        redirect: true,
        callbackUrl,
      });
      if (res?.error) {
        setError('Email ou senha inválidos.');
      }
    } catch (err) {
      setError('Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" type="email" required className="w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Senha</label>
        <input name="password" type="password" required className="w-full rounded border px-3 py-2" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="w-full rounded bg-primary text-white py-2">
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl })}
        className="w-full rounded border py-2"
      >
        Entrar com Google
      </button>
    </form>
  );
}
