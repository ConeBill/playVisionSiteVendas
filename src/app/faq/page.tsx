
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      q: "Vocês enviam para todo o Brasil?",
      a: "Sim, entregamos em todo o território nacional através dos Correios e transportadoras parceiras."
    },
    {
      q: "As canetas tinteiro acompanham tinta?",
      a: "A maioria das nossas canetas acompanha um cartucho inicial. Tintas em frasco devem ser adquiridas separadamente em nossa seção de Tintas."
    },
    {
      q: "Como faço para cuidar do meu diário de couro?",
      a: "O couro natural ganha pátina com o tempo. Recomendamos limpar apenas com um pano seco e evitar exposição direta e prolongada ao sol."
    },
    {
      q: "Posso personalizar meu pedido?",
      a: "Atualmente oferecemos gravação de iniciais em alguns modelos de diários e cadernos. Verifique a página do produto para ver se a opção está disponível."
    }
  ];

  return (
    <div className="container mx-auto px-6 py-20 max-w-3xl">
      <h1 className="font-headline text-4xl font-bold mb-12 text-center">Perguntas Frequentes</h1>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left font-bold">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
