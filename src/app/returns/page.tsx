
export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-6 py-20 max-w-3xl">
      <h1 className="font-headline text-4xl font-bold mb-8">Trocas e Devoluções</h1>
      <div className="space-y-6 text-muted-foreground">
        <p>Sua satisfação é nossa prioridade. Se você não estiver completamente satisfeito com sua compra, estamos aqui para ajudar.</p>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Prazo para Devolução</h2>
          <p>Você tem até 30 dias após o recebimento do produto para solicitar a devolução, desde que o item esteja em sua embalagem original e sem sinais de uso.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Como solicitar</h2>
          <p>Envie um e-mail para suporte@blushandink.com com o número do seu pedido e o motivo da troca ou devolução.</p>
        </section>
      </div>
    </div>
  );
}
