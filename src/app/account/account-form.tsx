'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User, LogOut, Pencil, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { FavoritesMenu } from '@/components/auth/FavoritesMenu';

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  address_number: string;
  address_complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  reference: string;
};

type AccountFormState = {
  mode: 'view' | 'edit';
  loading: boolean;
  saving: boolean;
  error: string;
  form: UserProfile;
};

const emptyUser: UserProfile = {
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
};

export default function AccountForm() {
  const router = useRouter();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [state, setState] = useState<AccountFormState>({
    mode: 'view',
    loading: true,
    saving: false,
    error: '',
    form: emptyUser,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: '' }));
    fetch('/api/account/profile')
      .then(res => (res.ok ? res.json() : Promise.reject()))
      .then(data => {
        if (!cancelled && data.user) {
          const normalized = { ...emptyUser, ...data.user } as UserProfile;
          setState(s => ({ ...s, form: normalized }));
        }
      })
      .catch(() => {
        if (!cancelled) toast({ title: 'Erro', description: 'Não foi possível carregar o perfil.', variant: 'destructive' });
      })
      .finally(() => {
        if (!cancelled) setState(s => ({ ...s, loading: false }));
      });

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, router]);

  const handleEdit = () => setState(s => ({ ...s, mode: 'edit', error: '' }));
  const handleCancelEdit = () => setState(s => ({ ...s, mode: 'view', error: '' }));

  const handleChange = (field: keyof UserProfile, value: string) => {
    setState(s => ({ ...s, form: { ...s.form, [field]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(s => ({ ...s, saving: true, error: '' }));
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.form),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Perfil atualizado', description: 'Suas informações foram salvas.' });
      setState(s => ({ ...s, mode: 'view', saving: false }));
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível atualizar o perfil.', variant: 'destructive' });
      setState(s => ({ ...s, saving: false }));
    }
  };

  if (state.loading) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="font-headline text-4xl font-bold mb-8">Minha Conta</h1>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const isEditing = state.mode === 'edit';

  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-4xl font-bold">Minha Conta</h1>
        {isEditing ? (
          <Button variant="outline" size="sm" onClick={handleCancelEdit}>
            <X className="w-4 h-4 mr-2" /> Cancelar edição
          </Button>
        ) : (
          <Button size="sm" onClick={handleEdit}>
            <Pencil className="w-4 h-4 mr-2" /> Editar dados
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="mb-6 rounded-md border border-primary/40 bg-primary/5 px-4 py-3 text-sm text-primary">
          Você está no modo edição. Altere os campos desejados e clique em Salvar alterações.
        </div>
      )}

      <div className={isEditing ? 'ring-2 ring-primary/40 rounded-xl' : ''}>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados pessoais</CardTitle>
                <CardDescription>Atualize suas informações de contato.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field label="Nome completo">
                  <Input value={state.form.name} onChange={e => handleChange('name', e.target.value)} required />
                </Field>
                <Field label="E-mail">
                  <Input type="email" value={state.form.email} onChange={e => handleChange('email', e.target.value)} required />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Telefone">
                    <Input value={state.form.phone} onChange={e => handleChange('phone', e.target.value)} />
                  </Field>
                  <Field label="CPF">
                    <Input value={state.form.cpf} onChange={e => handleChange('cpf', e.target.value)} />
                  </Field>
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
                    <Field label="Rua">
                      <Input value={state.form.address} onChange={e => handleChange('address', e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Número">
                    <Input value={state.form.address_number} onChange={e => handleChange('address_number', e.target.value)} />
                  </Field>
                </div>
                <Field label="Complemento">
                  <Input value={state.form.address_complement} onChange={e => handleChange('address_complement', e.target.value)} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Bairro">
                    <Input value={state.form.neighborhood} onChange={e => handleChange('neighborhood', e.target.value)} />
                  </Field>
                  <Field label="Cidade">
                    <Input value={state.form.city} onChange={e => handleChange('city', e.target.value)} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Estado">
                    <Input value={state.form.state} onChange={e => handleChange('state', e.target.value)} />
                  </Field>
                  <Field label="CEP">
                    <Input value={state.form.zip_code} onChange={e => handleChange('zip_code', e.target.value)} />
                  </Field>
                </div>
                <Field label="Referência">
                  <Input value={state.form.reference} onChange={e => handleChange('reference', e.target.value)} />
                </Field>
              </CardContent>
            </Card>

            <Button type="submit" disabled={state.saving} className="w-full md:w-auto">
              {state.saving ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <CardTitle>{state.form.name || 'Minha Conta'}</CardTitle>
                <CardDescription>{state.form.email}</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col gap-2">
                <FavoritesMenu />
                <Button variant="outline" className="w-full rounded-full" onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </CardFooter>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dados pessoais</CardTitle>
                  <CardDescription>Informações da sua conta.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ViewField label="Nome completo" value={state.form.name} />
                  <ViewField label="E-mail" value={state.form.email} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ViewField label="Telefone" value={state.form.phone} />
                    <ViewField label="CPF" value={state.form.cpf} />
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
                      <ViewField label="Rua" value={state.form.address} />
                    </div>
                    <ViewField label="Número" value={state.form.address_number} />
                  </div>
                  <ViewField label="Complemento" value={state.form.address_complement} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ViewField label="Bairro" value={state.form.neighborhood} />
                    <ViewField label="Cidade" value={state.form.city} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ViewField label="Estado" value={state.form.state} />
                    <ViewField label="CEP" value={state.form.zip_code} />
                  </div>
                  <ViewField label="Referência" value={state.form.reference} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ViewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label className="text-muted-foreground">{label}</Label>
      <p className="mt-1 text-sm">{value || '-'}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1">{children}</div>
    </div>
  );
}
