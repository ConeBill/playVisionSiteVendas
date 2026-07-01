'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User, Mail, Phone, MapPin, LogOut, Heart, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { FavoritesMenu } from '@/components/auth/FavoritesMenu';

export default function AccountForm() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    address_number: '',
    address_complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    reference: '',
  });

  const isLoggedIn = status === 'authenticated';

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetch('/api/account/profile')
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => {
        if (data.user) setForm(data.user);
      })
      .catch(() => toast({ title: 'Erro', description: 'Não foi possível carregar o perfil.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, [isLoggedIn, router]);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Perfil atualizado', description: 'Suas informações foram salvas.' });
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível atualizar o perfil.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Carregando...</p>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1">
        <CardHeader className="text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <CardTitle>{form.name || 'Minha Conta'}</CardTitle>
          <CardDescription>{form.email}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-2">
          <FavoritesMenu />
          <Button variant="outline" className="w-full rounded-full" onClick={() => signOut({ callbackUrl: '/' })}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </CardFooter>
      </Card>

      <div className="md:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados pessoais</CardTitle>
              <CardDescription>Atualize suas informações de contato.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome completo</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" value={form.name} onChange={e => handleChange('name', e.target.value)} required />
                </div>
              </div>
              <div>
                <Label>E-mail</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Telefone</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-10" value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input value={form.cpf} onChange={e => handleChange('cpf', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>Informações para entrega.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <Label>Rua</Label>
                  <Input className="mt-1" value={form.address} onChange={e => handleChange('address', e.target.value)} />
                </div>
                <div>
                  <Label>Número</Label>
                  <Input className="mt-1" value={form.address_number} onChange={e => handleChange('address_number', e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Complemento</Label>
                <Input className="mt-1" value={form.address_complement} onChange={e => handleChange('address_complement', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Bairro</Label>
                  <Input className="mt-1" value={form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)} />
                </div>
                <div>
                  <Label>Cidade</Label>
                  <Input className="mt-1" value={form.city} onChange={e => handleChange('city', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Estado</Label>
                  <Input className="mt-1" value={form.state} onChange={e => handleChange('state', e.target.value)} />
                </div>
                <div>
                  <Label>CEP</Label>
                  <Input className="mt-1" value={form.zip_code} onChange={e => handleChange('zip_code', e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Referência</Label>
                <Input className="mt-1" value={form.reference} onChange={e => handleChange('reference', e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={saving} className="w-full md:w-auto">
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      </div>
    </div>
  );
}
