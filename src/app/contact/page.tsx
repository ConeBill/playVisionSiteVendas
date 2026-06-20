
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-20 max-w-2xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="font-headline text-5xl font-bold">Fale Conosco</h1>
        <p className="text-muted-foreground">Estamos aqui para tirar suas dúvidas e ouvir suas sugestões.</p>
      </div>
      
      <form className="space-y-6 bg-white p-8 rounded-3xl border shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" placeholder="Seu nome completo" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea id="message" placeholder="Como podemos te ajudar?" className="min-h-[150px]" />
        </div>
        <Button className="w-full h-14 rounded-full text-lg font-bold">Enviar Mensagem</Button>
      </form>
    </div>
  );
}
