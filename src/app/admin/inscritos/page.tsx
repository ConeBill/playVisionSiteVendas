'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Subscriber = {
  id: number;
  email: string;
  created_at: string;
  unsubscribe_token: string;
};

type AdminResponse = {
  ok: boolean;
  total: number;
  page: number;
  limit: number;
  subscribers: Subscriber[];
};

export default function AdminNewsletterPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const checkAuth = async () => {
    const res = await fetch('/api/admin/newsletter', { method: 'GET' });
    if (res.ok) {
      setAuthed(true);
      loadSubscribers(1);
    }
  };

  const loadSubscribers = async (targetPage?: number) => {
    const currentPage = targetPage ?? page;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/newsletter?page=${currentPage}&limit=${limit}`);
      if (!res.ok) {
        setAuthed(false);
        return;
      }
      const json = (await res.json()) as AdminResponse;
      if (json.ok) {
        setSubscribers(json.subscribers);
        setTotal(json.total);
        setPage(json.page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar inscritos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json?.message || 'Falha ao autenticar.');
      }
      setAuthed(true);
      await loadSubscribers(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _logout: true }) });
    setAuthed(false);
    setSubscribers([]);
    setPassword('');
    setTotal(0);
    setPage(1);
  };

  const remove = async (email: string) => {
    if (!confirm(`Remover ${email}?`)) return;
    const res = await fetch('/api/admin/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      alert(json?.message || 'Falha ao remover.');
      return;
    }
    await loadSubscribers(page);
  };

  const downloadCSV = async () => {
    try {
      const res = await fetch('/api/admin/newsletter?page=1&limit=100');
      const json = (await res.json()) as AdminResponse;
      if (!json.ok) throw new Error('Falha ao carregar CSV');
      const all = json.subscribers;
      const rows = [
        ['id', 'email', 'data_cadastro'],
        ...all.map((s) => [String(s.id), s.email, s.created_at]),
      ];
      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inscritos-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao exportar CSV.');
    }
  };

  if (!authed) {
    return (
      <div className="container mx-auto px-6 py-24 max-w-md">
        <h1 className="font-headline text-2xl font-bold mb-6">Acesso restrito</h1>
        <p className="text-sm text-muted-foreground mb-4">Informe a senha para acessar o painel de inscritos.</p>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="mb-4"
        />
        <Button onClick={login} disabled={loading}>
          Entrar
        </Button>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-2xl font-bold">Inscritos na newsletter</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadCSV} disabled={loading || subscribers.length === 0}>
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={logout}>Sair</Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Total de inscrições: <span className="font-semibold text-foreground">{total}</span>
      </p>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">E-mail</th>
              <th className="text-left p-3">Data</th>
              <th className="text-left p-3">Token cancelamento</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.email}</td>
                <td className="p-3">{new Date(s.created_at).toLocaleString('pt-BR')}</td>
                <td className="p-3">
                  <span className="font-mono text-xs text-muted-foreground break-all">{s.unsubscribe_token}</span>
                </td>
                <td className="p-3 text-center">
                  <Button variant="ghost" size="sm" onClick={() => remove(s.email)}>Remover</Button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td className="p-3 text-center text-muted-foreground" colSpan={4}>Nenhum inscrito.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadSubscribers(page - 1)}
          disabled={page <= 1 || loading}
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadSubscribers(page + 1)}
          disabled={page >= totalPages || loading}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
