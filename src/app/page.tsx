
import { Hero } from '@/components/home/Hero';
import { ProductService } from '@/services/product-service';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles, PenTool } from 'lucide-react';
import Image from 'next/image';

export default async function Home() {
  const products = await ProductService.getFeaturedProducts();
  const categories = await ProductService.getCategories();
  const firstCategories = categories.length
    ? categories
    : [
        {
          id: 'uncategorized',
          name: 'Não catalogado',
          slug: 'nao-catalogado',
          imageUrl: 'https://picsum.photos/seed/nao-catalogado/400/400',
        },
      ];

  return (
    <div className="space-y-24">
      <Hero />

      {/* Categorias em destaque */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
          <Link href="/catalog?category=escolares" className="md:col-span-2 group relative overflow-hidden rounded-3xl border bg-secondary">
            <Image src="https://picsum.photos/seed/escolares-home/800/600" alt="Escolares" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
              <h3 className="font-headline text-3xl font-bold">Escolares</h3>
              <p className="text-sm text-white/80 mt-2">Itens escolares com estilo e carinho para o dia a dia.</p>
            </div>
          </Link>
          <Link href="/catalog?category=presentes" className="group relative overflow-hidden rounded-3xl border bg-muted">
             <Image src="https://picsum.photos/seed/presentes-home/400/400" alt="Presentes" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
              <h3 className="font-headline text-xl font-bold">Presentes</h3>
            </div>
          </Link>
          <div className="bg-primary/10 rounded-3xl p-8 flex flex-col justify-between border border-primary/20">
            <Sparkles className="w-10 h-10 text-primary" />
            <div>
              <h3 className="font-headline text-2xl font-bold text-primary">Novidades</h3>
              <p className="text-sm mt-2 mb-6">Confira os lançamentos da nossa papelaria.</p>
              <Button asChild size="sm" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white">
                <Link href="/catalog?sort=newest">Ver produtos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <h2 className="font-headline text-4xl font-bold">Nossa seleção</h2>
            <p className="text-muted-foreground max-w-lg">Presentes fofos e itens de papelaria selecionados para tornar cada momento mais especial.</p>
          </div>
          <Button variant="link" asChild className="text-primary gap-2">
            <Link href="/catalog">Ver todo catálogo <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 20).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-muted py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-headline text-xl font-bold">Qualidade premium</h4>
            <p className="text-muted-foreground text-sm">Selecionamos materiais de alta qualidade para nossos produtos.</p>
          </div>
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <PenTool className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-headline text-xl font-bold">Artesanato</h4>
            <p className="text-muted-foreground text-sm">Valorizamos o trabalho artesanal e os detalhes únicos.</p>
          </div>
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-headline text-xl font-bold">Frete para todo Brasil</h4>
            <p className="text-muted-foreground text-sm">Entregamos inspiração na sua casa, em todo o país.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
