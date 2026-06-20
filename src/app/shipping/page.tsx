
export default function ShippingPage() {
  return (
    <div className="container mx-auto px-6 py-20 max-w-3xl">
      <h1 className="font-headline text-4xl font-bold mb-8">Informações de Envio</h1>
      <div className="space-y-6 text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Prazos de Entrega</h2>
          <p>Trabalhamos com os melhores parceiros logísticos para garantir que sua encomenda chegue em perfeito estado. O prazo médio de entrega é de 3 a 7 dias úteis após a confirmação do pagamento.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Custo de Envio</h2>
          <p>O frete é calculado automaticamente no checkout com base no seu CEP. Oferecemos Frete Grátis para compras acima de R$ 350,00.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Rastreamento</h2>
          <p>Assim que seu pedido for enviado, você receberá um código de rastreio por e-mail para acompanhar cada passo da entrega.</p>
        </section>
      </div>
    </div>
  );
}
