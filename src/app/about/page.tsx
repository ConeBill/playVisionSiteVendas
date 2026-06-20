
export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl">
      <h1 className="font-headline text-5xl font-bold mb-12 text-center">Nossa História</h1>
      <div className="prose prose-lg mx-auto space-y-8 text-muted-foreground leading-relaxed">
        <p>
          Fundada em 2018, a <strong>Blush & Ink</strong> nasceu de uma paixão profunda pela arte da escrita à mão e pelo toque tátil do papel de alta qualidade.
        </p>
        <p>
          Em um mundo cada vez mais digital, acreditamos que existe algo sagrado em colocar a caneta no papel. É uma forma de desacelerar, refletir e expressar sua voz única com intenção e beleza.
        </p>
        <p>
          Nossa curadoria é feita com o maior cuidado, selecionando apenas os melhores instrumentos de escrita, papéis artesanais e acessórios de mesa que combinam funcionalidade excepcional com design atemporal.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
          <div className="space-y-4">
            <h3 className="font-headline text-2xl font-bold text-foreground">Missão</h3>
            <p>Inspirar a criatividade e a expressão pessoal através de ferramentas de papelaria excepcionais.</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-headline text-2xl font-bold text-foreground">Visão</h3>
            <p>Ser o destino preferido para amantes da caligrafia e entusiastas do papel em todo o mundo.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
