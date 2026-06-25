
'use client';

import Link from 'next/link';
import { Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || 'Falha ao se inscrever.');
      }
      toast({ description: 'Inscrição realizada com sucesso!' });
      setEmail('');
    } catch (error) {
      toast({
        description: error instanceof Error ? error.message : 'Erro ao se inscrever.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-muted mt-20 py-20 border-t">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="font-headline text-2xl font-bold tracking-wider text-primary">
            Play Vision Papelaria
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Selecionamos itens de papelaria com carinho desde 2018. Cada detalhe faz a diferença para transformar momentos do dia a dia.
          </p>
          <div className="flex gap-4">
            <button type="button" aria-label="Compartilhar" className="text-muted-foreground hover:text-primary">
              <Share2 className="w-5 h-5" />
            </button>
            <button type="button" aria-label="Contato" className="text-muted-foreground hover:text-primary">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-headline text-lg font-semibold mb-6">Loja</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/catalog" className="hover:text-primary">Todos os produtos</Link></li>
            <li><Link href="/catalog?category=escolares" className="hover:text-primary">Escolares</Link></li>
            <li><Link href="/catalog?category=presentes" className="hover:text-primary">Presentes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline text-lg font-semibold mb-6">Atendimento</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/shipping" className="hover:text-primary">Frete e entrega</Link></li>
            <li><Link href="/returns" className="hover:text-primary">Trocas e devoluções</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contato</Link></li>
            <li><Link href="/faq" className="hover:text-primary">Dúvidas frequentes</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-headline text-lg font-semibold">Receba novidades</h4>
          <p className="text-sm text-muted-foreground">Inscreva-se para ofertas exclusivas e novidades da papelaria.</p>
          <div className="flex gap-2">
            <Input
              placeholder="Seu e-mail"
              className="bg-background"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button size="icon" onClick={subscribe} disabled={loading}>
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-20 pt-8 border-t text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Play Vision Papelaria. Todos os direitos reservados.
      </div>
    </footer>
  );
}

