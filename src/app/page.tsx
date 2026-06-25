import { Hero } from '@/components/home/Hero';
import { ProductService } from '@/services/product-service';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryCard } from '@/components/home/category-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Star, Sparkles, PenTool } from 'lucide-react';
import type { Product } from '@/domain/models/product';

type CategoryCardData = {
  id: string;
  name: string;
  href: string;
  images: string[];
};

const FALLBACK_CATEGORY_IMAGE = '/img/hero-stationery.jpg';

async function loadCategoryCards(products: Product[]): Promise<CategoryCardData[]> {
  const pick = (categoryName: string): CategoryCardData => {
    const normalized = categoryName.toLowerCase();
    const matched = products
      .filter(p => (p.category || '').toLowerCase() === normalized)
      .flatMap(p => (p.images || []).filter((img): img is string => typeof img === 'string' && img.trim().length > 0));
    const images = matched.length
      ? matched.slice(0, 4)
      : Array.from({ length: 4 }, () => FALLBACK_CATEGORY_IMAGE);
    return {
      id: normalized,
      name: categoryName,
      href: `/catalog?category=${normalized}`,
      images,
    };
  };

  return [pick('Escolares'), pick('Presentes')];
}

export default async function Home() {
  let products: Product[] = [];
  try {
    products = (await ProductService.getFeaturedProducts()) ?? [];
  } catch {
    products = [];
  }

  const categoryCards: CategoryCardData[] = await loadCategoryCards(products);
  console.log('[Home] loadCategoryCards result', JSON.stringify(categoryCards, null, 2));

  return (
    <div className="space-y-24">
      <Hero />

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryCards.slice(0, 2).map(card => (
            <CategoryCard key={card.id} {...card} />
          ))}
          <div className="md:col-span-2 bg-primary/10 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-primary/20">
            <div>
              <h3 className="font-headline text-xl font-bold text-primary">Novidades</h3>
              <p className="text-xs md:text-sm mt-1 max-w-md">Confira os lançamentos da nossa papelaria.</p>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0 rounded-full border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/catalog?sort=newest">Ver produtos</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <h2 className="font-headline text-4xl font-bold">Nossa seleção</h2>
            <p className="text-muted-foreground max-w-lg">Presentes fofos e itens de papelaria selecionados para tornar cada momento mais especial.</p>
          </div>
          <Button variant="link" asChild className="text-primary gap-2">
            <Link href="/catalog">Ver todo catálogo</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 20).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

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
            <h4 className="font-headline text-xl font-bold">Papelaria</h4>
            <p className="text-muted-foreground text-sm">Peças selecionadas de papelaria para todos os momentos.</p>
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
