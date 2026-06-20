
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="font-headline text-4xl font-bold mb-8">Minha Conta</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-primary" />
              </div>
              <CardTitle>Jane Doe</CardTitle>
              <CardDescription>Membro desde 2024</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full rounded-full" onClick={() => setIsLoggedIn(false)}>Sair da Conta</Button>
            </CardFooter>
          </Card>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Você ainda não realizou nenhum pedido.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Endereços Salvos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Nenhum endereço cadastrado ainda.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-20 flex justify-center items-center min-h-[70vh]">
      <Card className="w-full max-w-md shadow-2xl border-primary/10 overflow-hidden">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none h-14 bg-muted/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-background rounded-none">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-background rounded-none">Criar Conta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="font-headline text-3xl font-bold">Bem-vindo</h2>
              <p className="text-sm text-muted-foreground">Acesse sua coleção exclusiva da Blush & Ink.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="seu@email.com" className="pl-10 rounded-full h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Button variant="link" className="px-0 h-auto text-xs text-primary">Esqueceu a senha?</Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" className="pl-10 rounded-full h-12" />
                </div>
              </div>
              <Button className="w-full h-12 rounded-full text-lg shadow-lg shadow-primary/20" onClick={() => setIsLoggedIn(true)}>
                <LogIn className="w-4 h-4 mr-2" /> Acessar Conta
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="font-headline text-3xl font-bold">Junte-se a nós</h2>
              <p className="text-sm text-muted-foreground">Crie sua conta e receba novidades exclusivas.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="reg-name" placeholder="Como devemos te chamar?" className="pl-10 rounded-full h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="reg-email" type="email" placeholder="seu@email.com" className="pl-10 rounded-full h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Crie uma Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="reg-password" type="password" className="pl-10 rounded-full h-12" />
                </div>
              </div>
              <Button className="w-full h-12 rounded-full text-lg shadow-lg shadow-primary/20" onClick={() => setIsLoggedIn(true)}>
                <UserPlus className="w-4 h-4 mr-2" /> Cadastrar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
