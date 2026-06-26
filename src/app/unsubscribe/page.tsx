'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token não informado.');
      return;
    }

    const run = async () => {
      setStatus('loading');
      try {
        const res = await fetch(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`);
        const text = await res.text();
        setStatus(res.ok ? 'success' : 'error');
        setMessage(text || (res.ok ? 'Inscrição cancelada.' : 'Não foi possível cancelar.'));
      } catch {
        setStatus('error');
        setMessage('Erro de conexão.');
      }
    };

    void run();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="font-headline text-2xl font-bold mb-4">Cancelar inscrição</h1>
        <p className="text-sm text-muted-foreground">
          {status === 'loading' && 'Processando cancelamento...'}
          {status === 'success' && 'Inscrição cancelada com sucesso.'}
          {status === 'error' && message}
        </p>
      </div>
    </div>
  );
}
